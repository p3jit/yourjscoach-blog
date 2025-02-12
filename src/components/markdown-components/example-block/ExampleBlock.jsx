import React, { Fragment } from 'react'

const ExampleBlock = ({children,input,output}) => {
  return (
    <Fragment>
        <h3 className='ml-2 text-zinc-100 font-normal text-lg'><span className='pr-2'>•</span>{children} -</h3>
        <section>
            <p className='bg-zinc-900 p-3 border-2 border-zinc-600 rounded-lg mt-2'>
                <span className='text-zinc-300 font-normal text-md'>Input - {input}</span><br/>
                <span className='text-zinc-300 font-normal text-md'>Output - {output}</span>
            </p>
        </section>
    </Fragment>
  )
}

export default ExampleBlock