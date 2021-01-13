import React, { useEffect, useState } from 'react'

import Loading from 'components/Loading'
import Chart from 'components/Chart'
import InputFile from 'components/InputFile'

import { githubAuth } from 'lib/query'


function App() {
  const [username, setUsername] = useState('[Loading...]')
  const [progress, setProgress] = useState<number>(0)

  const [data, setData] = useState({})

  useEffect(() => {
    startApp()
  }, [])

  async function startApp() {
    const authResult = await githubAuth()
    setUsername(authResult.data.viewer.login)
  }

  // File Input Handler
  function onFileChange(file: any) {
    const fileReader = new FileReader()

    // On File Reader done
    fileReader.addEventListener('load', () => {
      // Convert text to JSON object
      let json = {}
      try {
        json = JSON.parse(fileReader.result?.toString() || '')

        setData(json)
        console.log(json)
      } catch (e) {
        console.error(e)
        alert('File input cannot convert to JSON object.\nPlease check your file input.')
      }
    })

    // Start read file as text
    fileReader.readAsText(file)
    console.log(file.name)
  }

  return (
    <div className="container">
      <div>
        <p>
          <span>Github user: </span>
          <strong>{username}</strong>
        </p>
      </div>

      <div>
        <InputFile onChange={onFileChange}/>
      </div>

      <div>
        <Loading progress={progress}/>
      </div>

      <hr/>

      <div>
        <Chart setProgress={setProgress} data={data}/>
      </div>

    </div>
  )
}

export default App
