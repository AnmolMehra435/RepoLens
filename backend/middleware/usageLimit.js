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

  if (isNewDay) {
    user.dailyAnalysisCount = 0

    user.lastAnalysisDate = today
  }

  if (user.dailyAnalysisCount >= 5) {
    return res.status(403).json({
      message:
        'Daily analysis limit reached',
    })
  }

  user.dailyAnalysisCount += 1

  await user.save()

  next()
}