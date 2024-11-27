import { createClient } from "@supabase/supabase-js";
const supabaseURL = "https://aeyjtpnvqzyewgtlexaa.supabase.co";
const subabaseAPIkey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFleWp0cG52cXp5ZXdndGxleGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MjA2NTAsImV4cCI6MjA0ODE5NjY1MH0.W7g_gcGbeGiAwGQrJjWVstUKnPJ4Fm6wuosDOIv9aWI";

const supabase = createClient(supabaseURL, subabaseAPIkey);
export default supabase;
