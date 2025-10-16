import { Hono } from "npm:hono";
import { cors } from "hono/middleware/cors";
import { createClient } from "@supabase/supabase-js";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
// Logger middleware removed due to missing module
// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-88fa036a/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-88fa036a/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: "Email e senha são obrigatórios" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || '' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.error("Sign up error:", error);
      return c.json({ error: error.message }, 400);
    }

    console.log(`User created: ${email}`);
    return c.json({ user: data.user });
  } catch (error) {
    console.error("Sign up error:", error);
    return c.json({ error: "Erro ao criar conta: " + error.message }, 500);
  }
});

// Share products endpoint - creates a shareable code for products
app.post("/make-server-88fa036a/share-products", async (c) => {
  try {
    const { produtos } = await c.req.json();
    
    if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
      return c.json({ error: "Produtos inválidos" }, 400);
    }

    // Generate a unique share code (6 characters)
    const shareCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Store products with expiration (30 days)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    
    const shareData = {
      produtos,
      createdAt: new Date().toISOString(),
      expiresAt: expirationDate.toISOString(),
    };

    await kv.set(`shared-products:${shareCode}`, JSON.stringify(shareData));

    console.log(`Products shared with code: ${shareCode}`);
    return c.json({ shareCode, expiresAt: expirationDate.toISOString() });
  } catch (error) {
    console.error("Error sharing products:", error);
    return c.json({ error: "Erro ao compartilhar produtos: " + error.message }, 500);
  }
});

// Get shared products by code
app.get("/make-server-88fa036a/shared-products/:code", async (c) => {
  try {
    const code = c.req.param("code");
    
    if (!code) {
      return c.json({ error: "Código inválido" }, 400);
    }

    const data = await kv.get(`shared-products:${code}`);
    
    if (!data) {
      return c.json({ error: "Produtos não encontrados ou código expirado" }, 404);
    }

    const shareData = JSON.parse(data);
    
    // Check if expired
    if (new Date(shareData.expiresAt) < new Date()) {
      await kv.del(`shared-products:${code}`);
      return c.json({ error: "Código expirado" }, 404);
    }

    console.log(`Products retrieved for code: ${code}`);
    return c.json(shareData);
  } catch (error) {
    console.error("Error retrieving shared products:", error);
    return c.json({ error: "Erro ao buscar produtos: " + error.message }, 500);
  }
});

// Get all available shared products (for discovery)
app.get("/make-server-88fa036a/shared-products", async (c) => {
  try {
    const allShared = await kv.getByPrefix("shared-products:");
    
    const validShares = allShared
      .map(item => {
        try {
          const data = JSON.parse(item.value);
          const code = item.key.replace("shared-products:", "");
          
          // Filter out expired shares
          if (new Date(data.expiresAt) < new Date()) {
            kv.del(item.key); // Clean up expired
            return null;
          }
          
          return {
            code,
            productCount: data.produtos.length,
            createdAt: data.createdAt,
            expiresAt: data.expiresAt,
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return c.json({ shares: validShares });
  } catch (error) {
    console.error("Error listing shared products:", error);
    return c.json({ error: "Erro ao listar produtos compartilhados: " + error.message }, 500);
  }
});

Deno.serve(app.fetch);