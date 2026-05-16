import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contribuicoes = sqliteTable("contribuicoes", {
  id:         text("id").primaryKey(),
  giftId:     text("gift_id"),
  isSurpresa: integer("is_surpresa", { mode: "boolean" }).default(false).notNull(),
  valor:      integer("valor").notNull(),
  nome:       text("nome"),
  mensagem:   text("mensagem"),
  criadoEm:   text("criado_em").notNull(),
});

export type ContribuicaoRow = typeof contribuicoes.$inferSelect;
export type ContribuicaoInsert = typeof contribuicoes.$inferInsert;

export const convidados = sqliteTable("convidados", {
  id:                    text("id").primaryKey(),
  nome:                  text("nome").notNull(),
  convidados:            integer("convidados").notNull(),
  convidadosConfirmados: integer("convidados_confirmados"),
  lado:                  text("lado", { enum: ["noivo", "noiva"] }).notNull(),
  telefone:              text("telefone").default("").notNull(),
  confirmado:            integer("confirmado", { mode: "boolean" }).default(false).notNull(),
  confirmadoEm:          text("confirmado_em"),
  comparecera:           text("comparecera", { enum: ["sim", "nao"] }),
  ultimaAtualizacao:     text("ultima_atualizacao"),
});

export const config = sqliteTable("config", {
  key:   text("key").primaryKey(),
  value: text("value").notNull(),
});

export type ConvidadoRow = typeof convidados.$inferSelect;
export type ConvidadoInsert = typeof convidados.$inferInsert;
