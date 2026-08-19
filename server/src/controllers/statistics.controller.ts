import type { RequestHandler } from 'express'
import { getStatistics } from '../services/statistics.service.js'

export const show: RequestHandler = async (request, response) => {
  const statistics = await getStatistics(request.userId as number)
  response.status(200).json({ success: true, data: statistics })
}
