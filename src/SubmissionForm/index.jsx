import React, { useState } from 'react'
import { Formik } from 'formik'

export const SubmissionForm = () => {
 const [address, setAddress] = useState('');
  const withAddrMessage = addr => `Got address ${addr}`

  const [submitError, setSubmitError] = useState('')
  const withSubmitError = err => `Error with saving data: ${err}`

  const onSubmit = (values, { setErrors }) => {
    console.log('submitting')

    ipfs.add(values.text, (err, addr) => {
      if (err) {
        console.log('got error', err)
        setSubmitError(err)
        return;
      }

      console.log('got addr', addr)
      setAddress(addr)
    })
  }

  return (
    <Formik 
      initialValues={{text: ''}} 
      onSubmit={onSubmit}
    >
      {({values, handleChange, handleBlur, handleSubmit, errors}) => (
        <>
          <form className="max-w-2xl w-full flex flex-col items-center" onSubmit={handleSubmit}>
            <textarea name="text" className="my-3 block h-96 border w-full" value={values.text} onBlur={handleBlur} onChange={handleChange}></textarea>
            <button className="py-2 px-5 text-white bg-sky-400 rounded-full" type="submit">Submit</button>
          </form>

          <div>
            {submitError 
              ? withSubmitError(submitError) 
              : address
                ? withAddrMessage(address) 
                : "Press Submit to continue"
            }
          </div>
        </>
      )}
    </Formik>
  )
}
