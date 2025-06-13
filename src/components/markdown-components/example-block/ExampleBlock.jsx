import React, { Fragment } from 'react'

const ExampleBlock = ({input,output, name, explanation}) => {
  return (
    <Fragment>
        <h3 className='ml-2 text-zinc-100 font-normal text-lg'><span className='pr-2'>•</span>{name} -</h3>
        <section>
            <p className='bg-zinc-900 p-3 border border-0.5 border-zinc-600 rounded-lg mt-2'>
                <span className='text-zinc-300 font-normal text-md tracking-wider'>Input - {input}</span><br/>
                <span className='text-zinc-300 font-normal text-md tracking-wider'>Output - {output}</span><br/>
                <span className='text-zinc-300 font-normal text-md tracking-wider'>Explanation - {explanation}</span>
            </p>
        </section>
    </Fragment>
  )
}

export default ExampleBlock