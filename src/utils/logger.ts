// @ts-noCheck
import logger from "pino"
import pretty from "pino-pretty"
import dayjs from "dayjs"

const log = logger({
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
}, pretty())

export default log
