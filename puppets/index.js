//@ts-check
const dotenv = require("dotenv")
dotenv.config()
const headless = process.env.HEADLESS === "true" ? true : false
const url = process.env.URL
const delay = parseInt(process.env.DELAY)
const puppeteer = require("puppeteer")
const inlineManual = require("./inline-manual")
const express = require("express")
const server = express()
const fs = require("fs")
const path = require("path")
const directory = "./slideshow"

const job = {
  "inline-manual": inlineManual,
}

let global_state

server.get("/health", (req, res) => {
  res.json(global_state)
})

const clear_files = async () => {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) reject(err)
      let file_number = files.length
      if (files.length == 0) resolve()
      for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
          if (err) reject(err)
          file_number--
          if (file_number < 1) resolve()
        })
      }
    })
  })
}

server.listen(30666, async e => {
  let runner_TO
  console.log("Server Running")
  console.log({ url, delay })
  const runner = async () => {
    let webStatus, mobileStatus
    console.log("Waking up Puppets...")
    const webbrowser = await puppeteer.launch({ headless })
    const mobilebrowser = await puppeteer.launch({ headless })
    await clear_files()
    console.log("Running Puppets")
    const webpage = await webbrowser.newPage()
    const mobilepage = await mobilebrowser.newPage()
    const started = new Date()
    await webpage.goto(url)
    await mobilepage.goto(url)
    const web = inlineManual.web(webpage)
    const mobile = inlineManual.mobile(mobilepage)
    try {
      global_state = {
        started,
        finished: new Date(),
        web: await web,
        mobile: await mobile,
      }
    } catch (e) {
      global_state = {
        error: true,
        scope: e.scope,
        started,
        finished: new Date(),
        e,
      }
    }
    console.log({ global_state })
    await webbrowser.close()
    await mobilebrowser.close()
    runner_TO = setTimeout(runner, delay)
  }
  runner_TO = setTimeout(runner, 100)
  process.on("exit", async () => {
    console.log("Shutting Puppets Down")
    clearTimeout(runner_TO)
  })
})
