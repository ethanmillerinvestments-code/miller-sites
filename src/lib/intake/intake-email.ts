import { escapeHtml } from "@/lib/form-utils";

type EmailField = {
  label: string;
  value?: string;
};

type EmailLink = {
  label: string;
  href?: string;
};

type IntakeEmailSection = {
  title: string;
  fields?: EmailField[];
  blocks?: EmailField[];
};

type IntakeEmailTemplateInput = {
  eyebrow: string;
  title: string;
  summary?: EmailField[];
  actions?: EmailField[];
  links?: EmailLink[];
  sections: IntakeEmailSection[];
};

function filterFields(fields: EmailField[] = []) {
  return fields.filter((field) => Boolean(field.value?.trim()));
}

function sanitizeLinkHref(value: string) {
  if (!value) {
    return "";
  }

  if (value.startsWith("mailto:") || value.startsWith("tel:")) {
    return value;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

function filterLinks(links: EmailLink[] = []) {
  return links
    .map((link) => ({
      label: link.label,
      href: sanitizeLinkHref(link.href || ""),
    }))
    .filter((link) => Boolean(link.href));
}

function renderFieldValue(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function renderSummary(fields: EmailField[]) {
  if (fields.length === 0) {
    return "";
  }

  const cards = fields
    .map(
      (field) => `
        <div style="margin: 0 0 10px; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; background: rgba(255,255,255,0.03); padding: 14px 16px;">
          <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #a9a090; margin-bottom: 7px;">${escapeHtml(
            field.label
          )}</div>
          <div style="font-size: 15px; line-height: 1.5; color: #f7f1e9; font-weight: 600;">${renderFieldValue(
            field.value || ""
          )}</div>
        </div>
      `
    )
    .join("");

  return `
    <tr>
      <td style="padding: 18px 24px 8px;">
        <div style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #d5b185; margin-bottom: 12px;">Dispatch Summary</div>
        ${cards}
      </td>
    </tr>
  `;
}

function renderActions(fields: EmailField[]) {
  if (fields.length === 0) {
    return "";
  }

  const rows = fields
    .map(
      (field) => `
        <div style="margin: 0 0 10px;">
          <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #25190f; margin-bottom: 7px;">${escapeHtml(
            field.label
          )}</div>
          <div style="font-size: 15px; line-height: 1.6; color: #25190f; font-weight: 600;">${renderFieldValue(
            field.value || ""
          )}</div>
        </div>
      `
    )
    .join("");

  return `
    <tr>
      <td style="padding: 6px 24px 8px;">
        <div style="border: 1px solid rgba(216,170,115,0.42); border-radius: 18px; background: linear-gradient(135deg, rgba(241,196,140,0.95), rgba(216,170,115,0.9)); padding: 16px 18px;">
          ${rows}
        </div>
      </td>
    </tr>
  `;
}

function renderSection(section: IntakeEmailSection) {
  const fields = filterFields(section.fields);
  const blocks = filterFields(section.blocks);

  if (fields.length === 0 && blocks.length === 0) {
    return "";
  }

  const fieldRows = fields
    .map(
      (field) => `
        <tr>
          <td style="padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.07); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #9d9385; width: 180px; vertical-align: top;">${escapeHtml(
            field.label
          )}</td>
          <td style="padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.07); font-size: 14px; line-height: 1.65; color: #ede6db; vertical-align: top;">${renderFieldValue(
            field.value || ""
          )}</td>
        </tr>
      `
    )
    .join("");

  const blockRows = blocks
    .map(
      (block) => `
        <tr>
          <td colspan="2" style="padding: 14px 0 0;">
            <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #9d9385; margin-bottom: 8px;">${escapeHtml(
              block.label
            )}</div>
            <div style="font-size: 14px; line-height: 1.75; color: #ede6db;">${renderFieldValue(
              block.value || ""
            )}</div>
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <tr>
      <td style="padding: 8px 24px;">
        <div style="border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; background: rgba(255,255,255,0.03); padding: 18px 18px 12px;">
          <div style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #cdb08a; margin-bottom: 8px;">${escapeHtml(
            section.title
          )}</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            ${fieldRows}
            ${blockRows}
          </table>
        </div>
      </td>
    </tr>
  `;
}

function renderLinks(links: EmailLink[]) {
  if (links.length === 0) {
    return "";
  }

  const rows = links
    .map(
      (link) => `
        <div style="margin: 0 0 10px;">
          <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #9d9385; margin-bottom: 6px;">${escapeHtml(
            link.label
          )}</div>
          <a href="${escapeHtml(link.href || "")}" style="font-size: 14px; line-height: 1.6; color: #f1c48c; text-decoration: underline; word-break: break-all;">${escapeHtml(
            link.href || ""
          )}</a>
        </div>
      `
    )
    .join("");

  return `
    <tr>
      <td style="padding: 8px 24px 24px;">
        <div style="border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; background: rgba(255,255,255,0.03); padding: 18px;">
          <div style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #cdb08a; margin-bottom: 8px;">Links</div>
          ${rows}
        </div>
      </td>
    </tr>
  `;
}

export function formatIntakeEmailHtml({
  eyebrow,
  title,
  summary = [],
  actions = [],
  links = [],
  sections,
}: IntakeEmailTemplateInput) {
  const filteredSummary = filterFields(summary);
  const filteredActions = filterFields(actions);
  const filteredLinks = filterLinks(links);
  const renderedSections = sections.map(renderSection).join("");

  return `
    <!doctype html>
    <html>
      <body style="margin: 0; padding: 20px 0; background: #090b10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #f7f1e9;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background: #090b10;">
          <tr>
            <td style="padding: 0 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; max-width: 720px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden; background: linear-gradient(180deg, rgba(20,22,28,0.98) 0%, rgba(10,11,16,1) 100%);">
                <tr>
                  <td style="padding: 28px 24px 22px; border-bottom: 1px solid rgba(255,255,255,0.08); background: linear-gradient(135deg, rgba(216,170,115,0.14), rgba(255,255,255,0.01) 46%, rgba(125,183,176,0.08));">
                    <div style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #d7b287; margin-bottom: 10px;">${escapeHtml(
                      eyebrow
                    )}</div>
                    <div style="font-size: 31px; line-height: 1.16; color: #f7f1e9; font-weight: 700; letter-spacing: -0.03em;">${escapeHtml(
                      title
                    )}</div>
                  </td>
                </tr>
                ${renderSummary(filteredSummary)}
                ${renderActions(filteredActions)}
                ${renderedSections}
                ${renderLinks(filteredLinks)}
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function formatIntakeEmailText({
  eyebrow,
  title,
  summary = [],
  actions = [],
  links = [],
  sections,
}: IntakeEmailTemplateInput) {
  const lines: string[] = [eyebrow.toUpperCase(), title, ""];

  const filteredSummary = filterFields(summary);
  const filteredActions = filterFields(actions);
  const filteredLinks = filterLinks(links);

  if (filteredSummary.length > 0) {
    lines.push("DISPATCH SUMMARY");
    filteredSummary.forEach((field) => {
      lines.push(`${field.label}: ${field.value}`);
    });
    lines.push("");
  }

  if (filteredActions.length > 0) {
    lines.push("NEXT ACTION");
    filteredActions.forEach((field) => {
      lines.push(`${field.label}: ${field.value}`);
    });
    lines.push("");
  }

  sections.forEach((section) => {
    const fields = filterFields(section.fields);
    const blocks = filterFields(section.blocks);

    if (fields.length === 0 && blocks.length === 0) {
      return;
    }

    lines.push(section.title.toUpperCase());

    fields.forEach((field) => {
      lines.push(`${field.label}: ${field.value}`);
    });

    blocks.forEach((block) => {
      lines.push("");
      lines.push(`${block.label}:`);
      lines.push(block.value || "");
    });

    lines.push("");
  });

  if (filteredLinks.length > 0) {
    lines.push("LINKS");
    filteredLinks.forEach((link) => {
      lines.push(`${link.label}: ${link.href}`);
    });
    lines.push("");
  }

  return lines.join("\n").trim();
}
