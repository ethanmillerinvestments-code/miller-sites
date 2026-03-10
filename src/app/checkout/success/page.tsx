import type { Metadata } from "next";
import Link from "next/link";

import BrandLogo from "@/components/BrandLogo";
import { getCheckoutRouteConfig } from "@/lib/env";
import { siteConfig } from "@/lib/site";
import { createStripeClient } from "@/lib/stripe-server";

export const metadata: Metadata = {
  title: "Checkout Status",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

type CheckoutVerificationState = {
  verified: boolean;
  eyebrow: string;
  title: string;
  body: string;
  packageLabel: string;
  companyName: string;
};

async function getCheckoutVerificationState(
  sessionId: string | undefined
): Promise<CheckoutVerificationState> {
  if (!sessionId) {
    return {
      verified: false,
      eyebrow: "Checkout returned",
      title: "Payment is not verified yet.",
      body:
        "The redirect completed, but there is no verified Stripe session attached to this page load. Scope review and kickoff still wait for server-side confirmation.",
      packageLabel: "",
      companyName: "",
    };
  }

  const config = getCheckoutRouteConfig();
  if (!config.stripeSecretKey) {
    return {
      verified: false,
      eyebrow: "Checkout returned",
      title: "Payment is not verified yet.",
      body:
        "This deployment cannot verify Stripe sessions server-side right now. Scope review and kickoff still wait for verified payment confirmation.",
      packageLabel: "",
      companyName: "",
    };
  }

  try {
    const stripe = createStripeClient(config.stripeSecretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentVerified =
      session.status === "complete" &&
      (session.payment_status === "paid" ||
        session.payment_status === "no_payment_required");

    return {
      verified: paymentVerified,
      eyebrow: paymentVerified ? "Payment verified" : "Checkout returned",
      title: paymentVerified
        ? "Payment confirmed, scope review still comes next."
        : "Payment is not verified yet.",
      body: paymentVerified
        ? "Stripe shows the payment as confirmed on the server. The project still moves through written scope confirmation, signer review, timeline alignment, and kickoff planning before build work begins."
        : "Stripe has not confirmed payment on the server yet. Work does not start until confirmation and scope review are complete.",
      packageLabel:
        typeof session.metadata?.offerLabel === "string"
          ? session.metadata.offerLabel
          : "",
      companyName:
        typeof session.metadata?.companyName === "string"
          ? session.metadata.companyName
          : "",
    };
  } catch (error) {
    console.error("Checkout success verification failed:", error);
    return {
      verified: false,
      eyebrow: "Checkout returned",
      title: "Payment is not verified yet.",
      body:
        "Stripe session verification failed on the server. Scope review and kickoff still wait for confirmed payment status.",
      packageLabel: "",
      companyName: "",
    };
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  const state = await getCheckoutVerificationState(sessionId);

  return (
    <main className="min-h-screen bg-[#0b0c0f] px-4 py-16 text-stone-100 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-8 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(21,22,27,0.92),rgba(13,14,18,0.96))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-10">
        <BrandLogo />
        <div className="space-y-4">
          <p className="eyebrow">{state.eyebrow}</p>
          <h1 className="section-title text-5xl text-stone-50 sm:text-6xl">
            {state.title}
          </h1>
          <p className="muted-copy max-w-2xl text-lg leading-8">
            {state.body}
          </p>
        </div>

        <div className="grid w-full gap-4 md:grid-cols-2">
          <div className="lux-subtle rounded-[1.4rem] p-5">
            <p className="mini-label">Project summary</p>
            <p className="mt-3 text-sm leading-7 text-stone-200">
              {state.packageLabel || "Selected package will appear here once the Stripe session is available."}
            </p>
            {state.companyName ? (
              <p className="mt-2 text-sm leading-7 text-stone-300">
                Company: {state.companyName}
              </p>
            ) : null}
          </div>
          <div className="lux-subtle rounded-[1.4rem] p-5">
            <p className="mini-label">What happens next</p>
            <p className="mt-3 text-sm leading-7 text-stone-200">
              The next reply should confirm scope, deliverables, signer details,
              timeline, and kickoff details before build work begins.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="button-primary px-6 py-3.5 text-sm">
            Back to Site
          </Link>
          <a
            href={siteConfig.emailHref}
            className="button-secondary px-6 py-3.5 text-sm"
          >
            Email Leadcraft
          </a>
        </div>
      </div>
    </main>
  );
}
