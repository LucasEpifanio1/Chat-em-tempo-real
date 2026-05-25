import React, { useRef, useState, useEffect } from 'react'
import './Chat.css'

import { FaEye } from "react-icons/fa"
import { IoEyeOffSharp } from "react-icons/io5"

export default function Chat({ socket }) {

    const messageRef = useRef()
    const typingTimeout = useRef(null)

    const [messageList, setMessageList] = useState([])
    const [sentMessages, setSentMessages] = useState(0)
    const [emojes, setemojes] = useState(0)
    const [tema, setTema] = useState(true)
    const [lista, setlista] = useState(true)
    const [conexao, setconexao] = useState(socket.connected)
    const [digitando, setDigitando] = useState(false)
    const [boasVindas, setBoasVindas] = useState('')

    useEffect(() => {

        socket.on('connect', () => {
            setconexao(true)
        })

        socket.on('disconnect', () => {
            setconexao(false)
        })

        socket.on('receive_message', data => {
            setMessageList((current) => [...current, data])
        })

        return () => {

            socket.off('connect')
            socket.off('disconnect')
            socket.off('receive_message')

        }

    }, [socket])

    const handleSubmit = () => {

        const message = messageRef.current.value

        if (!message.trim()) return

        socket.emit('message', message)

        setSentMessages((current) => current + 1)

        const emojisEncontrados = message.match(
            /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu
        )

        if (emojisEncontrados) {
            setemojes((current) =>
                current + emojisEncontrados.length
            )
        }

        clearInput()
    }

    const clearInput = () => {
        messageRef.current.value = ''
    }

    const handleTheme = () => {

        if (tema === true) {
            setTema(false)
        } else {
            setTema(true)
        }
    }

    const handlelista = () => {

        if (lista === true) {
            setlista(false)
        } else {
            setlista(true)
        }
    }

    const handleTyping = () => {

        setDigitando(true)

        clearTimeout(typingTimeout.current)

        typingTimeout.current = setTimeout(() => {
            setDigitando(false)
        }, 1000)
    }

    let icone

    if (tema === true) {
        icone = '☀️'
    } else {
        icone = '🌙'
    }

    let icones

    if (lista === true) {
        icones = <FaEye color="black" />
    } else {
        icones = <IoEyeOffSharp color="black" />
    }
    const chatMessagesRef = useRef(null)

   useEffect(() => {

    chatMessagesRef.current.scrollTop =
        chatMessagesRef.current.scrollHeight

}, [messageList])


useEffect(() => {
setBoasVindas('Bem-vindo fulado de tals')
}, [])
    return (
        <div className={`chat-container ${tema ? 'dark' : 'light'}`}>

            <div className='chat-header'>

                <div className='header-top'>

                    <h1>Chat Online</h1>

                    <div className='buttons-header'>

                        <button onClick={handleTheme}>
                            {icone}
                        </button>

                        <button onClick={handlelista}>
                            {icones}
                        </button>

                    </div>

                </div>

                <p>
                    Mensagens enviadas: {sentMessages}
                </p>

                <p>
                    Emojes enviados: {emojes}
                </p>

                <p>
                    Status:
                    {
                        conexao
                            ? ' 🟢 Conectado'
                            : ' 🔴 Desconectado'
                    }
                </p>

                {
                    digitando && (
                        <p>
                            ✍️ Você está digitando...
                        </p>
                    )
                }

                <p>
                {boasVindas}
                </p>

            </div>

            

            {
                lista === true && (

                        <div
                        className='chat-messages'
                        ref={chatMessagesRef}
                        >

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
                )
            }

            <div className='chat-input-area'>

                <input
                    ref={messageRef}
                    type="text"
                    placeholder='Digite uma mensagem'
                    onChange={handleTyping}
                />

                <button onClick={handleSubmit}>
                    Enviar
                </button>


            </div>

        </div>
    )
}