import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req: Request) => {
  try {
    const base44 = createClientFromRequest(req);
    const A = base44.asServiceRole.entities;
    
    const results: any = {};
    
    // Try list with filter for known email
    try {
      const filtered = await A.BloomwireUser.list({ filter: { email: "debug@test.com" }, limit: 10 });
      results.filteredLength = filtered.length;
      results.filteredStr = JSON.stringify(filtered).substring(0, 500);
    } catch (e) {
      results.filterError = e.message;
    }
    
    // Try list with no params
    try {
      const noParams = await A.BloomwireUser.list();
      results.noParamsLength = noParams?.length;
      results.noParamsType = typeof noParams;
    } catch (e) {
      results.noParamsError = e.message;
    }
    
    // Try using .filter() instead of .list()
    try {
      const filtered2 = await A.BloomwireUser.filter({});
      results.filterMethodLength = filtered2?.length;
      results.filterMethodType = typeof filtered2;
    } catch (e) {
      results.filterMethodError = e.message;
    }
    
    // Try .find() 
    try {
      const found = await A.BloomwireUser.find({ email: "debug@test.com" });
      results.findResult = JSON.stringify(found).substring(0, 500);
    } catch (e) {
      results.findError = e.message;
    }
    
    // Try reading by ID
    try {
      const byId = await A.BloomwireUser.get("6a75f5f59daaebd361069c27");
      results.getByIdResult = JSON.stringify(byId).substring(0, 500);
    } catch (e) {
      results.getByIdError = e.message;
    }
    
    // Try listing with sort
    try {
      const sorted = await A.BloomwireUser.list({ limit: 100, sort: "-created_date" });
      results.sortedLength = sorted.length;
      if (sorted.length > 0) {
        results.firstSortedKeys = Object.keys(sorted[0]);
        results.firstSortedEmail = sorted[0].email;
      }
    } catch (e) {
      results.sortedError = e.message;
    }
    
    return Response.json({ success: true, data: results });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message });
  }
});
