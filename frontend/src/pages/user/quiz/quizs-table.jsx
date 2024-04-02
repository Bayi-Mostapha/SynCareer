import { axiosClient } from "@/api/axios";
import { columns } from "@/components/user/columns";
import DataTable from "@/components/general/data-table";
import React, { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import SynCareerLoader from "@/components/general/syncareer-loader";

function QuizTable() {
    const [data, setData] = useState([]);
    const [isFetching, setisFetching] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [errors, setErrors] = useState({});
    const [questions, setQuestions] = useState([]);
    const [questionValue, setQuestionValue] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState({
        id: 0,
        question: '',
        options: ['', '', '', ''],
        answer: ''
    });
    const [quizData, setQuizData] = useState({
        name: '',
        size: 0,
        duration: ''
    });
    const [selectOptions, setSelectOptions] = useState({
        options: []
    });
    const [open, setOpen] = useState(false);

    // fetch quizzes from database 
    const fetchQuizes = async () => {
        try {
            const { data } = await axiosClient.get('/quizzes');
            setisFetching(false);
            setData(data)
        } catch (error) {
            console.log('Error fetching conversations:', error);
        }
    };
    // insert into database          
    const insertQuiz = async () => {
        try {
            const payload = {
                quizData: quizData,
                questions: questions
            };
            const res = await axiosClient.post('/uploadQuiz', payload);
            console.log(res)
        } catch (error) {
            // Handle error
            console.error('Error uploading quiz:', error);
        }
    };
    useEffect(() => {
        const intervalId = setInterval(fetchQuizes, 3000); // Call fetchQuizzes every 3 seconds

        // Cleanup function to clear the interval when the component unmounts or when the dependency changes
        return () => clearInterval(intervalId);
    }, []);

    // const [isOpen, setIsOpen] = useState(false);

    // this is where i store data for new quiz 

    // handle inputs 
    const inputNameRef = useRef('');
    const inputNbrRef = useRef('');
    const inputDurationRef = useRef(0);
    const inputQuestionRef = useRef('');
    const inputoptionARef = useRef('');
    const inputoptionBRef = useRef('');
    const inputoptionCRef = useRef('');
    const inputoptionDRef = useRef('');

    //when user click submit in the first form
    const handleSubmit = () => {
        setErrors(null);
        const newErrors = {};
        if (quizData.name.trim() === "") {
            newErrors.name = "Name is required.";
        }
        if (quizData.size == "") {
            newErrors.size = "Number of questions is required.";
        } else {
            if (quizData.size == 0) {
                newErrors.size = "Number can't be 0";
            }
        }
        if (quizData.duration == "") {
            newErrors.duration = "duration is required.";
        } else {
            if (quizData.duration == 0) {
                newErrors.duration = "duration can't be 0";
            }
        }
        if (Object.keys(newErrors).length === 0) {
            setOpen(true);
        } else {
            setErrors(newErrors);
        }
    };
    // methods to handle inputs 
    const handleNameChange = (event) => {
        setErrors(null);
        const newName = event.target.value;
        setQuizData(prevQuizData => ({
            ...prevQuizData,
            name: newName
        }));
    };
    const handleNbrChange = (event) => {
        setErrors(null);
        const newSize = parseInt(event.target.value);
        setQuizData(prevQuizData => ({
            ...prevQuizData,
            size: newSize
        }));
    };
    const handleDurationChange = (event) => {
        setErrors(null);
        const newDuration = parseInt(event.target.value);
        setQuizData(prevQuizData => ({
            ...prevQuizData,
            duration: newDuration
        }));
    };
    const handleCloseDialog = () => {
        // setQuizData({
        //     name: '',
        //     size: 0,
        //     duration: ''
        // });
        // setQuestions([])
        // setCurrentQuestion({
        //     id: 0,
        //     question: '', // Set to default value
        //     options: ['', '', '', ''], // Set to default value
        //     answer: '' // Set to default value
        // });
        // setCurrentQuestionIndex(0)
        // setOpen(false);
        // document.getElementById('closeDialog')?.click();
    };
    ///////////////////////////////////////////////////////////////////
    const handleNext = () => {
        if (currentQuestionIndex < quizData.size) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    const handleBack = () => {
        if (currentQuestionIndex >= 1) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };


    useEffect(() => {
        setSelectOptions({
            options: []
        });
        const selectedQuestion = questions.find(question => question.id === currentQuestionIndex + 1);
        if (selectedQuestion) {
            setCurrentQuestion(prevQuestion => ({
                ...selectedQuestion
            }));
            setSelectOptions({
                options: selectedQuestion.options
            });
            console.log('ro1  ' + currentQuestionIndex);
            console.log(questions);

        } else {
            if (currentQuestion.id === 0) {
                setCurrentQuestion({
                    id: 1,
                    question: '',
                    options: ['', '', '', ''],
                    answer: ''
                });

            } else if (currentQuestion.id != 1) {
                setQuestions(prevQuestions => [...prevQuestions, currentQuestion]);
                setCurrentQuestion(prevQuestion => ({
                    ...prevQuestion,
                    id: prevQuestion.id + 1,
                    question: '',
                    options: ['', '', '', ''],
                    answer: ''
                }));
            } else {
                setQuestions([currentQuestion]);
                setCurrentQuestion(prevQuestion => ({
                    ...prevQuestion,
                    id: prevQuestion.id + 1,
                    question: '',
                    options: ['', '', '', ''],
                    answer: ''
                }));
            }
        }
        setQuestionValue(currentQuestion.question);
    }, [currentQuestionIndex]);

    useEffect(() => {
        if (quizData.size === questions.length && quizData.size !== 0) {
            insertQuiz()
            initialize();
            fetchQuizes();
        }
    }, [questions]);

    const initialize = () => {
        setCurrentQuestion({
            id: 0,
            question: '',
            options: ['', '', '', ''],
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
        setQuestionValue(event.target.value);
        setCurrentQuestion(prevQuestion => ({
            ...prevQuestion,
            question: event.target.value
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
        <div className="ml-20 mt-24 px-6 mb-10 overflow-x-auto">
            <div className="flex items-center justify-between py-5 overflow-x-auto">
                <h1 className="text-xl font-medium text-gray-700">hy reda el khayati,</h1>
                <div>
                    <div className="">
                        {/* isOpen={isOpen} onOpenChange={(isOpen) => isOpen ? setErrors(null) : handleCloseDialog()} */}
                        <Dialog >
                            <DialogTrigger className="py-2 px-5 bg-black text-white rounded-md">Set Quiz</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Quiz</DialogTitle>
                                    <DialogDescription className={!open ? '' : 'hidden'}>
                                        <Label htmlFor="quiz" className='block mt-3'>Quiz Name</Label>
                                        <Input id="quiz" className='mt-2' type="text" placeholder="Quiz name" ref={inputNameRef} onChange={handleNameChange} />
                                        <Label className="text-red-500 text-xs font-medium">{errors && errors.name}</Label>
                                        <Label htmlFor="nb" className='block mt-3'>Number of Questions</Label>
                                        <Input id="nb" className='mt-2' type="text" placeholder="Number of questions" ref={inputNbrRef} onChange={handleNbrChange} />
                                        <Label className="text-red-500 text-xs font-medium">{errors && errors.size}</Label>
                                        <Label htmlFor="duration" className='block mt-3'>Duration of each question(secondes)</Label>
                                        <Input id="duration" className='mt-2' type="text" placeholder="Duration per seconde" ref={inputDurationRef} onChange={handleDurationChange} />
                                        <Label className="text-red-500 text-xs font-medium">{errors && errors.duration}</Label>
                                    </DialogDescription>
                                    <DialogDescription className={open ? '' : 'hidden'}>
                                        <h2>Question {currentQuestionIndex + 1}</h2>
                                        <Label htmlFor={`question-1`} className='block mt-3'>Enter question</Label>
                                        <Input id={`question-1`} className='mt-2' type="text" placeholder={`Question 1`} value={currentQuestion.question} ref={inputQuestionRef} onChange={handleQuestionChange} />
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <Input className='mt-2' type="text" placeholder="option a" ref={inputoptionARef} onChange={handleoptionAChange} value={currentQuestion.options[0]} />
                                            </div>
                                            <div> <Input className='mt-2' type="text" placeholder="option b " ref={inputoptionBRef} onChange={handleoptionBChange} value={currentQuestion.options[1]} /></div>
                                        </div>
                                        <div className='flex items-center justify-between mb-2'>
                                            <div>
                                                <Input className='mt-2' type="text" placeholder="option c" ref={inputoptionCRef} onChange={handleoptionCChange} value={currentQuestion.options[2]} />
                                            </div>
                                            <div>
                                                <Input className='mt-2' type="text" placeholder="option d" ref={inputoptionDRef} onChange={handleoptionDChange} value={currentQuestion.options[3]} />
                                            </div>
                                        </div>
                                        <Select onValueChange={handleSelectChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select an option" />
                                            </SelectTrigger>
                                            <SelectContent >
                                                <SelectGroup>
                                                    {selectOptions.options.filter(option => option !== '').map((option, index) => (
                                                        <SelectItem key={index} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogPrimitive.Close className="py-2 px-5 bg-white text-black border border-black rounded-md" onClick={handleCloseDialog} >Cancel</DialogPrimitive.Close>
                                    <Button onClick={handleBack} className={!open || currentQuestionIndex <= 0 ? 'hidden' : 'py-5 px-7 bg-black text-white rounded-md hover:bg-black'}>back</Button>
                                    <Button onClick={open ? handleNext : handleSubmit} className={`py-5 px-7 bg-black text-white rounded-md hover:bg-black`}>Next</Button>
                                    <DialogPrimitive.Close className='bg-gray-500 hidden' id="closeDialog"></DialogPrimitive.Close>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    {/* ////////////////////////////////// */}
                </div>
            </div>
            {isFetching ?
                <div className="flex items-center justify-center p-10">
                    <SynCareerLoader />
                </div>
                :
                <DataTable columns={columns} data={data} searchColumn={"name"} />
            }
        </div>
    );
}

export default QuizTable;