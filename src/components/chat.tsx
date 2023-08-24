'use client'

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card"
import { Input } from "./ui/input"
import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from "./ui/scroll-area"
import { Skeleton } from "./ui/skeleton"
import Image from 'next/image';

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function Chat() {
    const [isLoading, setIsLoading] = useState(true);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const userId = getRandomInt(1, 1000000);
    const handleInput = async () => {
        setInput('');

        if(input === '') {
            return
        }

        const newMessage = { sender: 'You:', content: input, style: 'flex gap-2 text-slate-600 text-sm justify-end mt-8', avatar: 'https://avatars.githubusercontent.com/u/109170744?v=4' };
        setMessages([...messages, newMessage]);

        const requestBody = { input: input, id: userId };

        try {
            // const response = await fetch('https://drexai.rj.r.appspot.com/predict', {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if(!response.ok) {
                throw new Error(`request failed with status ${response.status}`)
            }
            const data = await response.json();

            const newResponse = { sender: 'Groot:', content: data.bot_response, style: 'flex gap-2 text-slate-600 text-sm mt-8', avatar: 'https://media.licdn.com/dms/image/C4E0BAQGyYeVLJFb-IA/company-logo_200_200/0/1641913708341?e=1700092800&v=beta&t=R3cAjt11_Y54RLcZSHnSthEtfB33EXlAT2hy3zXArvU' };
            setMessages([...messages, newMessage, newResponse]);
        }catch (error: any) {
            if (error instanceof Error) {
                console.error('Erro: ', error.message)
            } else {
                console.error('Erro desconhecido: ', error)
            }
        }


        setIsLoading(false)
    };        

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleInput()
        }
    }

    useEffect(() => {
        messageEndRef.current?.scrollIntoView();
    }, [messages]);


    return (
        <div>
            <Card className="w-[700px] " style={{borderRadius:'20px'}}>
                <CardHeader className="w-full" style={{background: '#1e1d1d', borderRadius:'20px 20px 0 0', height: '100px', padding: '10px 0 0 0' }}>
                {/* <Image src="/caminho/para/imagem.jpg" alt="Descrição da imagem" width={300} height={200} /> */}
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px] w-full pr-4 rounded-md" >
                        
                        { messages.map((message, index) => (
                            <div key={index}>
                                {message.sender === 'You:' && (
                                    <div className={message.style}>
                                        <Card className="max-w-[70%]" style={{background: '#1e1d1d', color: '#E4e4e4'}}>
                                            <CardContent className="flex w-full max-w-[100%] flex-col gap-2 rounded-lg px-3 py-2 text-sm" >
                                                {message.content}   
                                            </CardContent>
                                        </Card>

                                        <Avatar>
                                            <AvatarFallback>you</AvatarFallback>
                                            <AvatarImage src={message.avatar}></AvatarImage>
                                        </Avatar>

                                    </div>
                                )}
                                

                                {message.sender == 'Groot:' && (
                                        <div key={index} className={message.style}>
                                            <Avatar>
                                                <AvatarFallback>G</AvatarFallback>
                                                <AvatarImage src={message.avatar}></AvatarImage>
                                            </Avatar>
    
                                            <Card className="max-w-[70%]">
                                                <CardContent className="flex w-full max-w-[100%] flex-col gap-2 rounded-lg px-3 py-2 text-sm">
                                                    {message.content}   
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )
                                }

                                    
                                    

        
                            </div>
                                    
                        ))}        

                        <div ref={messageEndRef}/>
                    </ScrollArea>
                </CardContent>
                <CardFooter>
                    <div className="flex space-x-2 w-full" >
                        <Input type="text" placeholder="How can i help you?" value={input} onChange={e => setInput(e.target.value)} style={{borderRadius:'10px'}} onKeyDown={handleKeyPress} id="human_text"/>
                        <Button type="submit" onClick={handleInput} style={{borderRadius:'10px', background: '#1e1d1d'}}> Enviar </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
