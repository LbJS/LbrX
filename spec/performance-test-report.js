
!(async () => {
  'use-strict'
  const setNa = (elem) => {
    elem.innerHTML = 'N.A'
    elem.classList.remove('performance-pending')
    elem.classList.add('performance-na')
  }
  const setPending = (elem) => {
    elem.innerHTML = 'pending'
    elem.classList.add('performance-pending')
  }
  const performanceLogPath = 'performance-test-report.log.json'
  const setPerformanceValues = async (isSecondRun) => {
    let performanceLog
    try {
      performanceLog = await fetch(performanceLogPath).then(r => r.json())
    } catch (e) {
      console.error(`File: ${performanceLogPath} was not found or has invalid JSON content.`)
    }
    const suitePathElems = document.getElementsByClassName('suite-path')
    for (const suitePathElem of suitePathElems) {
      const suitePath = suitePathElem.innerHTML
      const suiteContainerElem = suitePathElem.parentElement.parentElement
      const suiteNameElems = suiteContainerElem.getElementsByClassName('test-suitename')
      for (const suiteNameElem of suiteNameElems) {
        const suiteName = suiteNameElem.innerHTML
        const testInfoElem = suiteNameElem.parentElement
        const testTitleElem = testInfoElem.getElementsByClassName('test-title')[0]
        const testDurationElem = testInfoElem.getElementsByClassName('test-duration')[0]
        if (!testDurationElem) continue
        if (!testTitleElem) {
          setNa(testDurationElem)
          continue
        }
        const testTitle = testTitleElem.innerHTML
        if (!suitePath || !suiteName || !testTitle) {
          setNa(testDurationElem)
          continue
        }
        if (!performanceLog.length && !isSecondRun) {
          setPending(testDurationElem)
          continue
        }
        const log = performanceLog.find(x => {
          return suitePath === x.testPath
            && x.testName.split(suiteName)[1] === ' ' + testTitle
            && x.testName.split(testTitle)[0] === suiteName + ' '
        })
        if (log) testDurationElem.innerHTML = log.time + 'ms'
        else if (isSecondRun) setNa(testDurationElem)
        else setPending(testDurationElem)
      }
    }
  }
  await setPerformanceValues()
  await new Promise(resolve => setTimeout(resolve, 5000))
  await setPerformanceValues(true)
})()
