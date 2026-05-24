import React, { useRef, useState, useEffect } from 'react'
import './Chat.css'

export default function Chat({ socket }) {

    const messageRef = useRef()

    const [messageList, setMessageList] = useState([])

    useEffect(() => {

        socket.on('receive_message', data => {
            setMessageList((current) => [...current, data])
        })

        return () => socket.off('receive_message')

    }, [socket])

    const handleSubmit = () => {

        const message = messageRef.current.value

        if (!message.trim()) return

        socket.emit('message', message)

        clearInput()
    }

    const clearInput = () => {
        messageRef.current.value = ''
    }

    return (
        <div className='chat-container'>

            <div className='chat-header'>
                Chat Online
            </div>

            <div className='chat-messages'>

                {
                    messageList.map((message, index) => (
                        <div
                            className='message'
                            key={index}
                        >
                            <span>
                                {message.author}
                            </span>

                            <p>
                                {message.text}
                            </p>
                        </div>
                    ))
                }

            </div>

            <div className='chat-input-area'>

                <input
                    ref={messageRef}
                    type="text"
                    placeholder='Digite uma mensagem'
                />

                <button onClick={handleSubmit}>
                    Enviar
                </button>

            </div>

        </div>
    )
}