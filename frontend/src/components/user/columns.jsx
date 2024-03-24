import React, { useState, useRef, useEffect } from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IoIosArrowDown } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { axiosClient } from "@/api/axios";

export const columns = [
    {
        accessorKey: "id",
        header: "id  ",
    },
    {
        accessorKey: "name",
        header: "quiz name",
    },
    {
        accessorKey: "nbr_applicants",
        header: "passes by ",
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    className="flex gap-2"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    created at <IoIosArrowDown />
                </Button>
            )
        },
    },
    {
        id: "actions",
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
            const quizId = row.original.id;
            const [dialogOpen, setDialogOpen] = useState(false);
            const [quizDataF, setQuizDataF] = useState({
                data: {
                    question_content: '',
                    option_a: '',
                }
            });
            const [formData, setFormData] = useState({
                quizName: '',
                numberOfQuestions: 0,
                durationPerSecond: 0,
            });

            const handleDelete = (quizId) => {
                axiosClient.delete(`/quizzes/${quizId}`)
                    .then(response => {
                        console.log('item deleted successfully');
                    })
                    .catch(error => {
                        console.error(error);
                    });
            };

            const handleUpdate = (quizId) => {
                axiosClient.get(`/quizzes/${quizId}`)
                    .then(response => {
                        console.log(response.data);
                        setQuizDataF(response.data);
                        setFormData({
                            quizName: response.data.name,
                            numberOfQuestions: response.data.size,
                            durationPerSecond: response.data.duration,
                        });
                        setDialogOpen(true);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            };

            const handleCloseDialog = () => {
                setDialogOpen(false);
            };
            // :::::::::::::::::::::::::::::::
            const handleInputChange = (e) => {
                const { name, value } = e.target;
                setFormData(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            };

            const handleSubmit = () => {
                setOpen(true);
            };
            
            const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
            const [questionValue, setQuestionValue] = useState('');
            const [questions, setQuestions] = useState([]);
            const [currentQuestion, setCurrentQuestion] = useState({
                id: 0,
                question: quizDataF.data[currentQuestionIndex]?.question_content || '',
                options: ['','','',''],
                answer: ''
            });
            
            const [selectOptions, setSelectOptions] = useState({
                options: []
            });
            const [open, setOpen] = useState(false);
           
            
            
            const inputNameRef = useRef('');
            const inputNbrRef = useRef('');
            const inputDurationRef = useRef(0);
            const inputQuestionRef = useRef('');
            const inputoptionARef = useRef('');
            const inputoptionBRef = useRef('');
            const inputoptionCRef = useRef('');
            const inputoptionDRef = useRef('');
        
            
           
        ///////////////////////////////////////////////////////////////////
            const handleNext = () => {
                if (currentQuestionIndex < formData.numberOfQuestions  ) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                }
            };
            const handleBack = () => {
                if (currentQuestionIndex >= 1) {
                    setCurrentQuestionIndex(currentQuestionIndex - 1);
                }
            };
          
        
        useEffect(() => {
             console.log(currentQuestionIndex);
                setSelectOptions({
                    options: []
                });
                const selectedQuestion = questions.find(question => question.id === currentQuestionIndex+1);
                if (selectedQuestion) {
                    setCurrentQuestion(prevQuestion => ({
                        ...selectedQuestion
                    }));
                    setSelectOptions({
                        options: selectedQuestion.options
                    });
                    console.log('ro1  '+currentQuestionIndex );
                    console.log(questions);
        
                }else{
                if(currentQuestion.id === 0){
                        setCurrentQuestion({
                            id: 1,
                            question: quizDataF.data[currentQuestionIndex]?.question_content || '', 
                            options: ['', '', '', ''], 
                            answer: '' 
                        });
                            
                }else if(currentQuestion.id != 1){
                        setQuestions(prevQuestions => [...prevQuestions, currentQuestion]);
                        setCurrentQuestion(prevQuestion => ({
                            ...prevQuestion,
                            id: prevQuestion.id + 1,
                            question: quizDataF.data[currentQuestionIndex]?.question_content || '',
                            options: ['', '', '', ''], 
                            answer: '' 
                        }));   
                    }else{  
                        setQuestions([currentQuestion]);
                        setCurrentQuestion(prevQuestion => ({
                            ...prevQuestion,
                            id: prevQuestion.id + 1 ,
                            question: quizDataF.data[currentQuestionIndex]?.question_content || '',
                            options: ['', '', '', ''], 
                            answer: '' 
                        }));
                    }
                }
                setQuestionValue(currentQuestion.question);
        }, [currentQuestionIndex]);
        
        useEffect(() => {
            if (formData.numberOfQuestions === questions.length + formData.numberOfQuestions && formData.numberOfQuestions !== 0) {
                // insertQuiz()
                // initialize();
                // fetchQuizes();
                console.log('yeeeeeeeeeeeeeeeees');
            } 
            console.log(questions);
        }, [questions]);
        
        const initialize = () =>{
            setCurrentQuestion({
                id: 0,
                question: quizDataF.data[currentQuestionIndex]?.question_content || '',
                options: ['','','',''],
                answer: ''
            });
            setQuizData({
                name: '',
                size: 0,
                duration: ''
            }); 
            setQuestions([]);
            document.getElementById('closeDialog')?.click();
            setOpen(false);
            setCurrentQuestionIndex(0);
        }
        const handleQuestionChange = (event) => {
            const newValue = event.target.value;
            setQuestionValue(newValue);
            setCurrentQuestion((prevQuestion) => ({
                ...prevQuestion,
                question: newValue !== '' ? newValue : prevQuestion.question
            }));
        };
        const handleoptionAChange = (event) => {
            setCurrentQuestion((prevQuestion) => ({
                ...prevQuestion,
                options: [event.target.value, ...prevQuestion.options.slice(1)]
            }));
            setSelectOptions((prevOptions) => ({
                options: [event.target.value, ...prevOptions.options.slice(1)]
            }));
        };
        const handleoptionBChange = (event) => {
            setCurrentQuestion((prevQuestion) => ({
                ...prevQuestion,
                options: [prevQuestion.options[0], event.target.value, ...prevQuestion.options.slice(2)]
            }));
            setSelectOptions((prevOptions) => ({
                options: [prevOptions.options[0], event.target.value, ...prevOptions.options.slice(2)]
            }));
        };
        const handleoptionCChange = (event) => {
            setCurrentQuestion((prevQuestion) => ({
                ...prevQuestion,
                options: [prevQuestion.options[0], prevQuestion.options[1], event.target.value, ...prevQuestion.options.slice(3)]
            }));
            setSelectOptions((prevOptions) => ({
                options: [prevOptions.options[0], prevOptions.options[1], event.target.value, ...prevOptions.options.slice(3)]
            }));
        };
        const handleoptionDChange = (event) => {
            setCurrentQuestion((prevQuestion) => ({
                ...prevQuestion,
                options: [prevQuestion.options[0], prevQuestion.options[1], prevQuestion.options[2], event.target.value]
            }));
            setSelectOptions((prevOptions) => ({
                options: [prevOptions.options[0], prevOptions.options[1], prevOptions.options[2], event.target.value]
            }));
        };
        const handleSelectChange = (newValue) => {
            setCurrentQuestion(prevQuestion => ({
                ...prevQuestion, 
                answer: newValue
            }));
        };
        
        
            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-0 text-gray-400 hover:bg-transparent">
                                <BsThreeDots />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleDelete(quizId)}>
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUpdate(quizId)}>
                                Update
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {dialogOpen && (
                        <Dialog open={dialogOpen} onClose={handleCloseDialog} >
                            <DialogTrigger className="py-2 px-5 bg-black text-white rounded-md">Set Quiz</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>update quiz</DialogTitle>
                                    <DialogDescription className={open ? 'hidden' : ''}>
                                        <Label htmlFor="quiz" className='block mt-3'>Quiz Name</Label>
                                        <Input id="quiz" className='mt-2' type="text" placeholder="Quiz name" name="quizName" value={formData.quizName} onChange={handleInputChange} ref={inputNameRef}/>
                                        <Label htmlFor="nb" className='block mt-3'>Number of Questions</Label>
                                        <Input id="nb" className='mt-2' type="number" placeholder="Number of questions" name="numberOfQuestions" value={formData.numberOfQuestions} onChange={handleInputChange} ref={inputNbrRef}/>
                                        <Label htmlFor="duration" className='block mt-3'>Duration of each question (seconds)</Label>
                                        <Input id="duration" className='mt-2' type="number" placeholder="Duration per second" name="durationPerSecond" value={formData.durationPerSecond} onChange={handleInputChange} ref={inputDurationRef}/>
                                    </DialogDescription>
                                    <DialogDescription className={open ? '' : 'hidden'}>
                                    <h2>Question {currentQuestionIndex + 1}</h2>
                                    <Label htmlFor={`question-1`} className='block mt-3'>Enter question</Label>
                                    <Input id={`question-1`} className='mt-2' type="text" placeholder={`Question 1`}  value={quizDataF.data[currentQuestionIndex]?.question_content || '' }  ref={inputQuestionRef} onChange={handleQuestionChange}/>
                                    <div className='flex items-center justify-between'>
                                    <div>
                                    <Input className='mt-2'  type="text" placeholder="option a"  ref={inputoptionARef} onChange={handleoptionAChange} value={quizDataF.data[currentQuestionIndex]?.option_a || ''} />
                                    </div>
                                    <div> <Input className='mt-2'  type="text" placeholder="option b "   ref={inputoptionBRef} onChange={handleoptionBChange}  value={quizDataF.data[currentQuestionIndex]?.option_b || ''} /></div>
                                    </div>
                                    <div className='flex items-center justify-between mb-2'>
                                    <div>
                                    <Input className='mt-2'  type="text" placeholder="option c"   ref={inputoptionCRef} onChange={handleoptionCChange}  value={quizDataF.data[currentQuestionIndex]?.option_c || ''} />
                                    </div>
                                    <div>
                                    <Input className='mt-2'  type="text" placeholder="option d"    ref={inputoptionDRef} onChange={handleoptionDChange} value={quizDataF.data[currentQuestionIndex]?.option_d || ''} />
                                    </div>
                                    </div>
                                    <Select onValueChange={handleSelectChange}>
                                    <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent >
                                    <SelectGroup>
                                        <SelectItem value={quizDataF.data[currentQuestionIndex]?.option_a || ''}>{quizDataF.data[currentQuestionIndex]?.option_a || ''}</SelectItem>
                                        <SelectItem value={quizDataF.data[currentQuestionIndex]?.option_b || ''}>{quizDataF.data[currentQuestionIndex]?.option_b || ''}</SelectItem>
                                        <SelectItem value={quizDataF.data[currentQuestionIndex]?.option_c || ''}>{quizDataF.data[currentQuestionIndex]?.option_c || ''}</SelectItem>
                                        <SelectItem value={quizDataF.data[currentQuestionIndex]?.option_d || ''}>{quizDataF.data[currentQuestionIndex]?.option_d || ''}</SelectItem>
                                    </SelectGroup>
                                    </SelectContent>
                                    </Select>
                            </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogPrimitive.Close className="py-2 px-5 bg-white text-black border border-black rounded-md" onClick={handleCloseDialog} >Cancel</DialogPrimitive.Close>
                        <Button onClick={handleBack} className={!open || currentQuestionIndex <= 0   ? 'hidden' : 'py-5 px-7 bg-black text-white rounded-md hover:bg-black'}>back</Button>
                        <Button onClick={open ? handleNext : handleSubmit} className={`py-5 px-7 bg-black text-white rounded-md hover:bg-black`}>Next</Button>
                        <DialogPrimitive.Close className='bg-gray-500 hidden'  id="closeDialog"></DialogPrimitive.Close>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
                              
                                   
                            )}
                </>
            );
        },
    },
];
