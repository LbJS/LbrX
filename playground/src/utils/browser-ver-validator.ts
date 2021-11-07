
// tslint:disable: only-arrow-functions
// tslint:disable: prefer-var
// tslint:disable: no-var-keyword
// tslint:disable: prefer-const

const enum BrowserStates {
  ok,
  toUpdate,
  outDated
}

var browserVerSettings = {
  chrome: {
    update: 74,
    outdated: 70,
  },
  firefox: {
    update: 66,
    outdated: 63,
  },
  opera: {
    update: 60,
    outdated: 57,
  },
  edge: {
    update: 17,
    outdated: 17,
  },
  safari: {
    update: 12,
    outdated: 11,
  }
}

export function validateBrowserVer(): void {
  try {
    // tslint:disable: prefer-const
    var browserId: [string, number] = getBrowserId()
    var browserName: string = browserId[0].toLowerCase()
    var browserVer: number = browserId[1]
    var browserState: BrowserStates = getBrowserState(browserName, browserVer)
    if (browserState == BrowserStates.outDated) {
      onDomLoaded(showOutDatedMsg.bind(null, browserName))
    } else if (browserState == BrowserStates.toUpdate) {
      onDomLoaded(showToUpdateMsg)
    }
  } catch (e) {
    console.error(e)
  }
}

function onDomLoaded(func: () => void): void {
  if (document.readyState === `complete` ||
    (document.readyState !== `loading` &&
      !document.documentElement.onscroll)
  ) {
    func()
  } else {
    window.addEventListener(`DOMContentLoaded`, func, { once: true })
  }
}

function getBrowserId(): [string, number] {
  var result: [string, string] | null = null
  var userAgent: string = navigator.userAgent
  var temp: RegExpMatchArray | RegExpExecArray | null
  var match: RegExpMatchArray = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
  if (/trident/i.test(match[1])) {
    temp = /\brv[ :]+(\d+)/g.exec(userAgent) || []
    result = (`IE ` + (temp[1] || ``)).split(` `) as [string, string]
  } else if (match[1] === `Chrome`) {
    temp = userAgent.match(/\b(OPR|Edge)\/(\d+)/)
    if (temp !== null) {
      result = temp.slice(1)
        .join(` `)
        .replace(`OPR`, `Opera`)
        .split(` `) as [string, string]
    }
  }
  if (!result) {
    match = match[2] ?
      [match[1], match[2]] :
      [`-?`, `-?`, `-?`]
    temp = userAgent.match(/version\/(\d+)/i)
    if (temp != null) match.splice(1, 1, temp[1])
    result = match.join(` `).split(` `) as [string, string]
  }
  return [result[0], +result[1]]
}

function getBrowserState(
  browserName: string,
  browserVer: number
): BrowserStates {
  var result: BrowserStates = BrowserStates.ok
  switch (browserName) {
    case `chrome`:
      if (browserVer < browserVerSettings.chrome.outdated) {
        result = BrowserStates.outDated
      } else if (browserVer < browserVerSettings.chrome.update) {
        result = BrowserStates.toUpdate
      }
      break
    case `firefox`:
      if (browserVer < browserVerSettings.firefox.outdated) {
        result = BrowserStates.outDated
      } else if (browserVer < browserVerSettings.firefox.update) {
        result = BrowserStates.toUpdate
      }
      break
    case `opera`:
      if (browserVer < browserVerSettings.opera.outdated) {
        result = BrowserStates.outDated
      } else if (browserVer < browserVerSettings.opera.update) {
        result = BrowserStates.toUpdate
      }
      break
    case `safari`:
      if (browserVer < browserVerSettings.safari.outdated) {
        result = BrowserStates.outDated
      } else if (browserVer < browserVerSettings.safari.update) {
        result = BrowserStates.toUpdate
      }
      break
    case `edge`:
      if (browserVer < browserVerSettings.edge.outdated) {
        result = BrowserStates.outDated
      } else if (browserVer < browserVerSettings.edge.update) {
        result = BrowserStates.toUpdate
      }
      break
    case `ie`:
      result = BrowserStates.outDated
  }
  return result
}

function showOutDatedMsg(browserName: string): void {
  var body = document.querySelector(`body`)
  if (!body) return
  body.innerHTML = ``
  body.style.backgroundColor = `white`
  body.style.textAlign = `center`
  var h1 = document.createElement(`h1`)
  h1.style.color = `black`
  if (browserName == `ie`) {
    h1.innerText = `Your browser is not supported!`
  } else {
    h1.innerText = `Your browser is outdated!\nPlease update your browser.`
  }
  body.appendChild(h1)
}

function showToUpdateMsg(): void {
  var body = document.querySelector(`body`)
  if (!body) return
  var div = document.createElement(`div`)
  div.innerText = `Your browser hasn't been updated for a while. Please consider updating your browser.`
  div.style.color = `black`
  div.style.backgroundColor = `orange`
  div.style.position = `absolute`
  div.style.top = `0`
  div.style.textAlign = `center`
  div.style.borderBottom = `1px solid black`
  div.style.width = `100%`
  div.style.paddingBottom = `5px`
  div.style.zIndex = `9999`
  body.appendChild(div)
  setTimeout(function (): void {
    if (body) body.removeChild(div)
  }, 15000)
}
