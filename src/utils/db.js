import { supabase } from "../supabaseclient";

export const configured = !!(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const MAINTAINER_KEY = import.meta.env.VITE_MAINTAINER_KEY || "maintainer";

export async function dbInsert(payload) {
  const { error } = await supabase.from("hookworm_reports").insert([payload]);
  if (error) throw new Error(error.message);
}

export async function dbFetch() {
  const { data, error } = await supabase
    .from("hookworm_reports")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function dbFetchByEarmark(earmark) {
  const { data, error } = await supabase
    .from("hookworm_reports")
    .select("*")
    .eq("earmark", earmark)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function dbUpdate(id, payload) {
  const { error } = await supabase
    .from("hookworm_reports")
    .update(payload)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function dbFlag(id, reason) {
  const { error } = await supabase
    .from("hookworm_reports")
    .update({ flagged: true, flag_reason: reason })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function dbDelete(id) {
  const { error } = await supabase
    .from("hookworm_reports")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function dbFetchFlagged() {
  const { data, error } = await supabase
    .from("hookworm_reports")
    .select("*")
    .eq("flagged", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}
