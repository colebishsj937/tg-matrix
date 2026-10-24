#!/usr/bin/env node
/**
 * TG Matrix Skills MCP — stdio，包装本机 tgmxd HTTP API。
 * 默认 dry-run；真实加退群/邀请/发信需 confirm=true。
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const BASE = (process.env.TGMX_URL || "http://127.0.0.1:17999").replace(/\/$/, "");

async function api(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body !== undefined) {
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return json;
}

function accountPool(a) {
  if (Array.isArray(a.accountIds) && a.accountIds.length) {
    return a.accountIds;
  }
  if (a.accountId) {
    return [a.accountId];
  }
  return [];
}

const server = new Server(
  { name: "tg-matrix-skills", version: "0.2.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "tgmx_health",
      description: "Check tgmxd daemon health on localhost",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "tgmx_accounts_list",
      description: "List imported Telegram accounts",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "tgmx_accounts_import",
      description: "Import session from local jsonPath and/or sessionPath",
      inputSchema: {
        type: "object",
        properties: {
          jsonPath: { type: "string" },
          sessionPath: { type: "string" },
          label: { type: "string" },
        },
      },
    },
    {
      name: "tgmx_accounts_check",
      description: "Check account authorization",
      inputSchema: {
        type: "object",
        required: ["accountId"],
        properties: { accountId: { type: "string" } },
      },
    },
    {
      name: "tgmx_spambot",
      description: "Ask @SpamBot for account restriction status",
      inputSchema: {
        type: "object",
        required: ["accountId"],
        properties: {
          accountId: { type: "string" },
          waitSeconds: { type: "number", default: 5 },
        },
      },
    },
    {
      name: "tgmx_send_dm",
      description:
        "Send DMs. Default dry-run. Set confirm=true only after user approval.",
      inputSchema: {
        type: "object",
        required: ["targets", "text"],
        properties: {
          accountId: { type: "string" },
          accountIds: { type: "array", items: { type: "string" } },
          targets: { type: "array", items: { type: "string" } },
          text: { type: "string" },
          mode: {
            type: "string",
            enum: ["username", "phone", "userId"],
            default: "username",
          },
          confirm: { type: "boolean", default: false },
          intervalMs: { type: "number" },
          failStopAfter: { type: "number" },
        },
      },
    },
    {
      name: "tgmx_groups_list",
      description: "List joined groups from local cache",
      inputSchema: {
        type: "object",
        properties: {
          accountId: { type: "string" },
          all: { type: "boolean", default: true },
        },
      },
    },
    {
      name: "tgmx_groups_refresh",
      description: "Refresh joined groups from Telegram into local cache",
      inputSchema: {
        type: "object",
        properties: {
          accountId: { type: "string" },
          all: { type: "boolean" },
          limit: { type: "number" },
        },
      },
    },
    {
      name: "tgmx_groups_batch",
      description:
        "Join or leave groups. Default dry-run; confirm=true to execute.",
      inputSchema: {
        type: "object",
        required: ["accountIds", "action", "targets"],
        properties: {
          accountIds: { type: "array", items: { type: "string" } },
          action: { type: "string", enum: ["join", "leave"] },
          targets: { type: "array", items: { type: "string" } },
          confirm: { type: "boolean", default: false },
          intervalMs: { type: "number" },
          failStopAfter: { type: "number" },
        },
      },
    },
    {
      name: "tgmx_invite",
      description:
        "Invite members into a group. Default dry-run; confirm=true to execute.",
      inputSchema: {
        type: "object",
        required: ["accountIds", "group", "members"],
        properties: {
          accountIds: { type: "array", items: { type: "string" } },
          group: { type: "string" },
          members: { type: "array", items: { type: "string" } },
          mode: { type: "string", enum: ["username", "contact"], default: "username" },
          confirm: { type: "boolean", default: false },
          intervalMs: { type: "number" },
        },
      },
    },
    {
      name: "tgmx_scrape_group",
      description: "Scrape group members and/or recent speakers",
      inputSchema: {
        type: "object",
        required: ["accountId", "group"],
        properties: {
          accountId: { type: "string" },
          group: { type: "string" },
          sources: {
            type: "array",
            items: { type: "string", enum: ["members", "speakers"] },
          },
          memberLimit: { type: "number" },
          historyLimit: { type: "number" },
        },
      },
    },
    {
      name: "tgmx_phones_check",
      description: "Check which phones are registered on Telegram",
      inputSchema: {
        type: "object",
        required: ["accountIds", "phones"],
        properties: {
          accountIds: { type: "array", items: { type: "string" } },
          phones: { type: "array", items: { type: "string" } },
          intervalMs: { type: "number" },
        },
      },
    },
    {
      name: "tgmx_marketing_products_list",
      description: "List marketing products",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "tgmx_marketing_product_upsert",
      description: "Create or update a marketing product profile",
      inputSchema: {
        type: "object",
        required: ["name"],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          sellingPoints: { type: "string" },
          audience: { type: "string" },
          avoidAudience: { type: "string" },
          offer: { type: "string" },
          landingUrl: { type: "string" },
          tone: { type: "string" },
          bannedWords: { type: "string" },
          cta: { type: "string" },
          status: { type: "string" },
        },
      },
    },
    {
      name: "tgmx_marketing_collect",
      description: "Scrape speakers into marketing leads for a product",
      inputSchema: {
        type: "object",
        required: ["productId", "accountId", "group"],
        properties: {
          productId: { type: "string" },
          accountId: { type: "string" },
          group: { type: "string" },
          historyLimit: { type: "number" },
        },
      },
    },
    {
      name: "tgmx_marketing_leads",
      description: "List marketing leads for a product",
      inputSchema: {
        type: "object",
        required: ["productId"],
        properties: { productId: { type: "string" } },
      },
    },
    {
      name: "tgmx_tasks_list",
      description: "List recent tasks",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "tgmx_tasks_items",
      description: "List task item results",
      inputSchema: {
        type: "object",
        required: ["taskId"],
        properties: { taskId: { type: "string" } },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const name = req.params.name;
  const a = req.params.arguments || {};
  try {
    let result;
    switch (name) {
      case "tgmx_health":
        result = await api("GET", "/health");
        break;
      case "tgmx_accounts_list":
        result = await api("GET", "/v1/accounts");
        break;
      case "tgmx_accounts_import":
        result = await api("POST", "/v1/accounts/import", {
          jsonPath: a.jsonPath,
          sessionPath: a.sessionPath,
          label: a.label,
        });
        break;
      case "tgmx_accounts_check":
        result = await api("POST", `/v1/accounts/${a.accountId}/check`, {});
        break;
      case "tgmx_spambot":
        result = await api("POST", `/v1/accounts/${a.accountId}/spambot`, {
          waitSeconds: a.waitSeconds || 5,
        });
        break;
      case "tgmx_send_dm": {
        const ids = accountPool(a);
        if (!ids.length) throw new Error("accountId or accountIds required");
        result = await api("POST", "/v1/messages/send", {
          accountIds: ids,
          targets: a.targets,
          text: a.text,
          mode: a.mode || "username",
          confirm: !!a.confirm,
          intervalMs: a.intervalMs || 1500,
          failStopAfter: a.failStopAfter || 5,
        });
        break;
      }
      case "tgmx_groups_list":
        result = await api(
          "GET",
          a.all || !a.accountId
            ? "/v1/groups/joined?all=1"
            : `/v1/groups/joined?accountId=${encodeURIComponent(a.accountId)}`
        );
        break;
      case "tgmx_groups_refresh":
        result = await api("POST", "/v1/groups/joined/refresh", {
          accountId: a.accountId,
          all: !!a.all || !a.accountId,
          limit: a.limit || 100,
        });
        break;
      case "tgmx_groups_batch": {
        const ids = accountPool(a);
        if (!ids.length) throw new Error("accountIds required");
        result = await api("POST", "/v1/groups/batch", {
          accountIds: ids,
          action: a.action || "join",
          targets: a.targets,
          confirm: !!a.confirm,
          intervalMs: a.intervalMs || 2000,
          failStopAfter: a.failStopAfter || 5,
        });
        break;
      }
      case "tgmx_invite": {
        const ids = accountPool(a);
        if (!ids.length) throw new Error("accountIds required");
        result = await api("POST", "/v1/groups/invite", {
          accountIds: ids,
          group: a.group,
          members: a.members,
          mode: a.mode || "username",
          confirm: !!a.confirm,
          intervalMs: a.intervalMs || 2000,
        });
        break;
      }
      case "tgmx_scrape_group":
        result = await api("POST", "/v1/scrape/group", {
          accountId: a.accountId,
          group: a.group,
          sources: a.sources || ["members", "speakers"],
          memberLimit: a.memberLimit || 0,
          historyLimit: a.historyLimit || 0,
        });
        break;
      case "tgmx_phones_check": {
        const ids = accountPool(a);
        if (!ids.length) throw new Error("accountIds required");
        result = await api("POST", "/v1/scrape/phones", {
          accountIds: ids,
          phones: a.phones,
          intervalMs: a.intervalMs || 1500,
        });
        break;
      }
      case "tgmx_marketing_products_list":
        result = await api("GET", "/v1/marketing/products");
        break;
      case "tgmx_marketing_product_upsert":
        result = await api("POST", "/v1/marketing/products", {
          id: a.id,
          name: a.name,
          sellingPoints: a.sellingPoints,
          audience: a.audience,
          avoidAudience: a.avoidAudience,
          offer: a.offer,
          landingUrl: a.landingUrl,
          tone: a.tone,
          bannedWords: a.bannedWords,
          cta: a.cta,
          status: a.status || "active",
        });
        break;
      case "tgmx_marketing_collect":
        result = await api("POST", "/v1/marketing/campaign/collect", {
          productId: a.productId,
          accountId: a.accountId,
          group: a.group,
          historyLimit: a.historyLimit || 0,
        });
        break;
      case "tgmx_marketing_leads":
        result = await api(
          "GET",
          `/v1/marketing/products/${encodeURIComponent(a.productId)}/leads`
        );
        break;
      case "tgmx_tasks_list":
        result = await api("GET", "/v1/tasks");
        break;
      case "tgmx_tasks_items":
        result = await api("GET", `/v1/tasks/${a.taskId}/items`);
        break;
      default:
        throw new Error(`unknown tool: ${name}`);
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (err) {
    return {
      content: [{ type: "text", text: String(err?.message || err) }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
