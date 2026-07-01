import { createServerClient } from "./supabase";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  budget: string | null;
  timeline: string | null;
  message: string;
  ip_address: string | null;
  created_at: string;
}

export interface InquiriesPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface InquiriesResult {
  inquiries: Inquiry[];
  pagination: InquiriesPagination;
}

const DEFAULT_PAGE_SIZE = 25;

export async function fetchInquiriesFromDb(
  requestedPage: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<InquiriesResult | null> {
  try {
    const supabase = createServerClient();

    const { count, error: countError } = await supabase
      .from("project_inquiries")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("[Admin Inquiries] count error:", countError);
      return null;
    }

    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    let page =
      Number.isFinite(requestedPage) && requestedPage > 0
        ? Math.floor(requestedPage)
        : 1;
    page = Math.min(Math.max(1, page), totalPages);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("project_inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("[Admin Inquiries] fetch error:", error);
      return null;
    }

    return {
      inquiries: (data ?? []) as Inquiry[],
      pagination: { page, pageSize, total, totalPages },
    };
  } catch (error) {
    console.error("[Admin Inquiries] unexpected error:", error);
    return null;
  }
}
