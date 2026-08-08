// Server-side daily check-in — prevents clock manipulation
// Uses server time, not client device time
export default async function checkInDaily(req: any) {
  const { userEmail } = req.body || {};
  
  if (!userEmail) {
    return { success: false, message: "User email required" };
  }
  
  // Use SERVER time, not client time
  const serverDate = new Date();
  const today = serverDate.toISOString().split('T')[0]; // YYYY-MM-DD in UTC
  
  // Check if user already checked in today
  try {
    const todayCheckIns = await base44.entities.CheckInRecord.filter({ 
      userEmail, 
      checkInDate: today 
    }).list();
    
    if (todayCheckIns && todayCheckIns.length > 0) {
      return { success: false, message: "Already checked in today" };
    }
  } catch (e) {
    console.log("CheckIn check failed:", e);
  }
  
  // Get yesterday's check-in to calculate streak
  const yesterday = new Date(serverDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  let streakDay = 1;
  try {
    const yesterdayCheckIns = await base44.entities.CheckInRecord.filter({ 
      userEmail, 
      checkInDate: yesterdayStr 
    }).list();
    
    if (yesterdayCheckIns && yesterdayCheckIns.length > 0) {
      streakDay = (yesterdayCheckIns[0].data?.streakDay || 1) + 1;
      if (streakDay > 7) streakDay = 1; // Reset after 7-day cycle
    }
  } catch (e) {
    console.log("Yesterday check failed:", e);
  }
  
  // Streak rewards: [3, 5, 7, 10, 12, 15, 20]
  const STREAK_REWARDS = [3, 5, 7, 10, 12, 15, 20];
  const petalsAwarded = STREAK_REWARDS[((streakDay - 1) % 7)];
  
  // Record this check-in
  try {
    await base44.entities.CheckInRecord.create({
      userEmail,
      checkInDate: today,
      streakDay,
      petalsAwarded
    });
  } catch (e) {
    console.log("CheckIn record failed:", e);
  }
  
  return {
    success: true,
    streakDay,
    petalsAwarded,
    message: `Day ${streakDay} streak! You earned ${petalsAwarded} Petals!`
  };
}
