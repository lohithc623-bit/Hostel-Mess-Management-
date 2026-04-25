import cron from 'node-cron';
import { MealRegistration } from '../models/MealRegistration.js';
import { Fine } from '../models/Fine.js';

const createFinesForMissedMeals = async (mealType) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const missedRegistrations = await MealRegistration.find({
      date: today,
      mealType,
      status: 'registered'
    });

    for (const reg of missedRegistrations) {
      reg.status = 'fined';
      await reg.save();

      const newFine = new Fine({
        studentId: reg.studentId,
        date: today,
        mealType,
        reason: 'Did not attend registered meal'
      });
      await newFine.save();
    }
    console.log(`Fines processed for ${mealType} on ${today}: ${missedRegistrations.length}`);
  } catch (err) {
    console.error(`Error in fine cron job for ${mealType}:`, err);
  }
};

// 9:01 AM for lunch today (wait, lunch scanning usually happens at lunch time)
// The requirement says:
// 9:01 AM -> for all students who registered for lunch today but status is still "registered" -> mark as "fined"
// Actually, usually you fine AFTER the meal is over.
// Let's stick to the user's specific times:
// - 9:01 AM -> lunch (Wait, if a student registers for lunch, they have until lunch time to scan. 9:01 AM is just after registration deadline, but BEFORE lunch happens. Usually registration deadline is 9 AM, but meal is 12-2 PM. If you fine at 9:01 AM, you fine people who haven't even had the chance to eat yet!)
// I suspect the user meant 9:01 PM? Or 9:01 AM for YESTERDAY'S lunch?
// Re-reading: "9:01 AM -> for all students who registered for lunch today but status is still 'registered' -> mark as 'fined'"
// This seems logically weird, but I will follow instructions if it's explicit.
// Wait, "breakfast: register until 9 PM prev day", "lunch: register until 9 AM same day", "dinner: register until 4 PM same day".
// "9:01 AM -> lunch today", "4:01 PM -> dinner today", "11:59 PM -> breakfast today"
// If the goal is that once registration closes, you are "committed", but you are fined only if you DON'T show up. You can't know they didn't show up until the meal is OVER.
// Maybe the user means 9:01 AM *next day*?
// Let's assume the times are when the meal periods END.
// Standard hostel times: Breakfast (7-9 AM), Lunch (12-2 PM), Dinner (7-9 PM).
// So:
// 9:01 AM -> Breakfast (just ended)
// 2:01 PM -> Lunch (just ended)
// 9:01 PM -> Dinner (just ended)
//
// But let's look at the instructions again:
// "Run cron jobs at these times every day:
// - 9:01 AM → for lunch today ...
// - 4:01 PM → same for dinner today
// - 11:59 PM → same for breakfast today"
// This is definitely weird. I'll stick to the user's explicit times but maybe they meant for the PREVIOUS meal that just finished.
// Let's re-interpret: 11:59 PM for breakfast today makes sense (end of day).
// 9:01 AM for lunch today? Lunch hasn't even started.
// 4:01 PM for dinner today? Dinner hasn't even started.
// I will implement exactly what's requested, but I'll add logs.

cron.schedule('1 9 * * *', () => {
  console.log('Running Lunch Fine Cron (9:01 AM)');
  createFinesForMissedMeals('lunch');
});

cron.schedule('1 16 * * *', () => {
  console.log('Running Dinner Fine Cron (4:01 PM)');
  createFinesForMissedMeals('dinner');
});

cron.schedule('59 23 * * *', () => {
  console.log('Running Breakfast Fine Cron (11:59 PM)');
  createFinesForMissedMeals('breakfast');
});
