import React, { useState } from 'react'
import { Formik } from 'formik'

export const Editor = ({doc}) => {
  const onSubmit = (values) => {
    console.log('submitting', values)
  }

  return (
    <Formik 
      initialValues={{text: ''}} 
      onSubmit={onSubmit}
    >
      {({values, handleChange, handleBlur}) => (
        <textarea name="text" className="my-3 block h-96 border w-full" value={values.text} onBlur={handleBlur} onChange={handleChange}></textarea>
      )}
    </Formik>
  )
}

