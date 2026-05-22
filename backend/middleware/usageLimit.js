export async function checkUsageLimit(
  req,
  res,
  next
) {
  const user = req.user

  const today = new Date()

  const lastDate =
    user.lastAnalysisDate

  const isNewDay =
    !lastDate ||
    lastDate.toDateString() !==
      today.toDateString()

  // RESET DAILY LIMIT
  if (isNewDay) {
    user.dailyAnalysisCount = 0

    user.lastAnalysisDate = today
  }

  // PLAN LIMITS
  let limit = 5

  if (user.plan === 'pro') {
    limit = 25
  }

  if (user.plan === 'max') {
    limit = 100
  }

  // LIMIT CHECK
  if (
    user.dailyAnalysisCount >= limit
  ) {
    return res.status(403).json({
      message:
        `Daily analysis limit reached (${limit}/day)`,

      limit,
    })
  }

  // INCREMENT USAGE
  user.dailyAnalysisCount += 1

  await user.save()

  next()
}