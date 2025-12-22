import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useReferences(user) {
  const [references, setReferences] = useState([]);
  const [editingRef, setEditingRef] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  async function loadReferences() {
    if (!user) return;

    const { data, error } = await supabase
      .from("references")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setReferences(data);
  }

  async function saveReference({ link, category, note }) {
    setIsSaving(true);
    setError(null);

    let res;
    if (editingRef) {
      res = await supabase
        .from("references")
        .update({ link, category, note })
        .eq("id", editingRef.id);
    } else {
      res = await supabase
        .from("references")
        .insert([{ user_id: user.id, link, category, note }]);
    }

    if (res.error) {
      setError(res.error.message);
    } else {
      if (editingRef) {
        setReferences((prev) =>
          prev.map((r) =>
            r.id === editingRef.id ? { ...r, link, category, note } : r
          )
        );
        setEditingRef(null);
      } else {
        await loadReferences();
      }
    }

    setIsSaving(false);
  }

  async function deleteReference(id) {
    const { error } = await supabase.from("references").delete().eq("id", id);

    if (!error) {
      setReferences((prev) => prev.filter((r) => r.id !== id));
    }
  }

  useEffect(() => {
    if (user) loadReferences();
    else setReferences([]);
  }, [user]);

  return {
    references,
    editingRef,
    setEditingRef,
    isSaving,
    error,
    saveReference,
    deleteReference,
  };
}
