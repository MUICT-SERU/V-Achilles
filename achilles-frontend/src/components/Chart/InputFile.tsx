import React from 'react'

interface IProps {
  onChange: any
}

const InputFile = (props: IProps) => {
  function fileChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (e && e.target && e.target.files) {
      if (e.target.files.length > 0) {
        props.onChange(e.target.files[0])
      } else {
        props.onChange(null)
      }
    }
  }

  return (
    <input onChange={fileChangeHandler} type="file"/>
  )
}

export default InputFile
