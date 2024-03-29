import React, { useState, useEffect, useRef } from 'react';
import { axiosClient } from "@/api/axios";
import { set } from 'react-hook-form';
import { useParams } from 'react-router-dom';


function PassQuiz() {
    const { id } = useParams()

    const [quizData, setQuizData] = useState(null); // State to store quiz data
    const [startQuiz, setStartQuiz] = useState(false); // State to store quiz data
    const [currentQuestion, setCurrentQuestion] = useState(0); // State to keep track of current question
    const [selectedOptions, setSelectedOptions] = useState([]); // State to store selected options
    const [errors, setErrors] = useState(null); // State to store errors
    const [counter, setCounter] = useState(0); // State for the counter
    const [flag, setFlag] = useState(false); // State for the counter
    const InputRadioA = useRef();
    const InputRadioB = useRef();
    const InputRadioC = useRef();
    const InputRadioD = useRef();

    const getQuizData = async (id) => {
        try {
            const { data } = await axiosClient.get(`/quizzes/${id}`, {});
            setQuizData(data);
            console.log(data);
        } catch (error) {
            console.log('quiz fetching error ', error);
        }
    };

    const handleStartQuiz = () => {
        console.log(currentQuestion);
        setStartQuiz(true);

    };
    const calculateScore = async () => {
        try {
            const payload = {
                selectedAnswers: selectedOptions,
                quizId: id
            };
            console.log('payload', selectedOptions);
            const response = await axiosClient.post('/calculateScore', payload);
            const { success, score } = response.data;

            if (success) {
                console.log('Score:', score);
            } else {
                console.error('Failed to calculate score');
            }
        } catch (error) {
            console.error('Error calculating score:', error);
        }
    };
    const handleNext = () => {
        setCurrentQuestion(currentQuestion + 1);
        console.log(currentQuestion)
        console.log(quizData.length)
        if (quizData.data.length - 1 <= currentQuestion) {
            setFlag(true);
            setStartQuiz(false);
        }
        if (quizData.length > currentQuestion + 1) {
            let answer = '';
            if (InputRadioA.current.checked) {
                answer = InputRadioA.current.value;
            } else
                if (InputRadioB.current.checked) {
                    answer = InputRadioB.current.value;
                } else
                    if (InputRadioC.current.checked) {
                        answer = InputRadioC.current.value;
                    } else
                        if (InputRadioD.current.checked) {
                            answer = InputRadioD.current.value;
                        }
            const selectedOptionsForCurrentQuestion = {
                id: quizData.data[currentQuestion].id,
                selected: answer
            };
            setSelectedOptions([...selectedOptions, selectedOptionsForCurrentQuestion]);

            // Proceed to next question
            setErrors(null);

            InputRadioA.current.checked = false;
            InputRadioB.current.checked = false;
            InputRadioC.current.checked = false;
            InputRadioD.current.checked = false;
            setErrors(null);
        } else {
            let answer = '';
            if (InputRadioA.current.checked) {
                answer = InputRadioA.current.value;
            } else
                if (InputRadioB.current.checked) {
                    answer = InputRadioB.current.value;
                } else
                    if (InputRadioC.current.checked) {
                        answer = InputRadioC.current.value;
                    } else
                        if (InputRadioD.current.checked) {
                            answer = InputRadioD.current.value;
                        }
            const selectedOptionsForCurrentQuestion = {
                id: quizData.data[currentQuestion].id,
                selected: answer
            };
            setSelectedOptions([...selectedOptions, selectedOptionsForCurrentQuestion]);

        }

    };

    useEffect(() => {
        if (startQuiz) {
            const interval = setInterval(() => {
                setCounter(prevCounter => {
                    const newCounter = prevCounter + 1;
                    console.log('Counter:', newCounter);

                    if (newCounter === quizData.duration) {
                        console.log('Counter reached 10!');
                        document.getElementById('nextBtn').click();
                        return 0;
                    }
                    return newCounter;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [startQuiz]);


    const isAtLeastOneOptionSelected = () => {
        return (
            InputRadioA.current.checked ||
            InputRadioB.current.checked ||
            InputRadioC.current.checked ||
            InputRadioD.current.checked
        );
    };

    const getSelectedOption = () => {
        if (InputRadioA.current.checked) {
            return InputRadioA.current.value;
        } else if (InputRadioB.current.checked) {
            return InputRadioB.current.value;
        } else if (InputRadioC.current.checked) {
            return InputRadioC.current.value;
        } else if (InputRadioD.current.checked) {
            return InputRadioD.current.value;
        }
        return ''; // No option selected
    };

    useEffect(() => {
        getQuizData(id);
    }, []);
    useEffect(() => {
        if (flag) {
            calculateScore();
            setFlag(false);
        }


    }, [flag]);

    return (
        <>
            <div className="bg-white p-5 absolute top-16 left-0 bottom-0 right-0 flex items-center justify-center flex-col">
                {!startQuiz ? (
                    <div className="flex items-center justify-center flex-col">
                        {quizData ? (
                            <>
                                <h1 className='text-black text-2xl font-bold mb-5'>Pay attention</h1>
                                <button className="bg-primary text-white rounded-md px-3 py-2" onClick={handleStartQuiz}>Start Quiz</button>
                            </>
                        ) : (
                            <div className="flex items-center justify-center flex-col">
                                <h1>error 401</h1>
                                <p>You are not allowed to pass this quiz</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <p>{counter}</p>
                        <p>{quizData.data[currentQuestion].question_content}</p>
                        <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                            <input id="option_a" ref={InputRadioA} type="radio" value={quizData.data[currentQuestion].option_a} name="options" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label for="option_a" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{quizData.data[currentQuestion].option_a}</label>
                        </div>
                        <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                            <input id="option_b" ref={InputRadioB} type="radio" value={quizData.data[currentQuestion].option_b} name="options" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label for="option_b" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{quizData.data[currentQuestion].option_b}</label>
                        </div>
                        <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                            <input id="option_c" ref={InputRadioC} type="radio" value={quizData.data[currentQuestion].option_c} name="options" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label for="option_c" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{quizData.data[currentQuestion].option_c}</label>
                        </div>
                        <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                            <input id="option_d" ref={InputRadioD} type="radio" value={quizData.data[currentQuestion].option_d} name="options" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label for="option_d" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{quizData.data[currentQuestion].option_d}</label>
                        </div>
                       
                        
                        <div>
                            {errors ?
                                <p className='bg-red-100 text-red-600 p-2 rounded-md'>{errors}</p>
                                :
                                ''}
                        </div>
                        <button onClick={handleNext} id="nextBtn"> Next</button>
                    </div>
                )}
            </div>
        </>
    );
}

export default PassQuiz;
