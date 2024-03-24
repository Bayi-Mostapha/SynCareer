import React, { useState, useEffect, useRef } from 'react';
import { axiosClient } from "@/api/axios";


function PassQuiz() {
    const [quizData, setQuizData] = useState(null); // State to store quiz data
    const [startQuiz, setStartQuiz] = useState(false); // State to store quiz data
    const [currentQuestion, setCurrentQuestion] = useState(0); // State to keep track of current question
    const [selectedOptions, setSelectedOptions] = useState([]); // State to store selected options
    const [errors, setErrors] = useState(null); // State to store errors
    const [counter, setCounter] = useState(5); // State for the counter
    const InputRadioA = useRef();
    const InputRadioB = useRef();
    const InputRadioC = useRef();
    const InputRadioD = useRef();

    const getQuizData = async () => {
        try {
            const { data } = await axiosClient.post('/quizzes/31',{});
            setQuizData(data);
            console.log(data);
        } catch (error) {
            console.log('Error fetching conversations:', error);
        }
    };

    const handleStartQuiz = () => {
        setStartQuiz(true);
    };

    const handleNext = () => {
        setCurrentQuestion(currentQuestion + 1);
        console.log('bro 1')
        console.log(currentQuestion)
        console.log(quizData.length)
        if (quizData.length - 1 <= currentQuestion ){
            setStartQuiz(false);
        }
        if (quizData.length > currentQuestion + 1 ) {
            let answer = '';
           if (InputRadioA.current.checked) {
             answer = InputRadioA.current.value ;
           } else
           if (InputRadioB.current.checked) {
             answer = InputRadioB.current.value ;
           } else
           if (InputRadioC.current.checked) {
              answer = InputRadioC.current.value ;
           } else
           if (InputRadioD.current.checked) {
              answer = InputRadioD.current.value ;
           } 
           const selectedOptionsForCurrentQuestion = {
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
        }else{
            let answer = '';
            if (InputRadioA.current.checked) {
              answer = InputRadioA.current.value ;
            } else
            if (InputRadioB.current.checked) {
              answer = InputRadioB.current.value ;
            } else
            if (InputRadioC.current.checked) {
               answer = InputRadioC.current.value ;
            } else
            if (InputRadioD.current.checked) {
               answer = InputRadioD.current.value ;
            }
            const selectedOptionsForCurrentQuestion = {
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
            
                    if (newCounter === 10) {
                        console.log('Counter reached 10!');
                        document.getElementById('nextBtn').click();
                        return  0 ;
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
        getQuizData();
    }, []);
    useEffect(() => {
        console.log(selectedOptions)
    }, [selectedOptions]);

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
                                <h1>error 404</h1>
                                <p>You are not allowed to pass this quiz</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <p>{counter}</p>
                        <p>{quizData[currentQuestion].question_content}</p>
                        <div>
                            <input
                                type="radio"
                                name="options"
                                id={"option_a"}
                                ref={InputRadioA}
                                value={quizData[currentQuestion].option_a}
                            />
                            <label htmlFor={"option_a"}>{quizData[currentQuestion].option_a}</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="options"
                                id={"option_b"}
                                ref={InputRadioB}
                                value={quizData[currentQuestion].option_b}
                            />
                            <label htmlFor={"option_b"}>{quizData[currentQuestion].option_b}</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="options"
                                id={"option_c"}
                                ref={InputRadioC}
                                value={quizData[currentQuestion].option_c}
                            />
                            <label htmlFor={"option_c"}>{quizData[currentQuestion].option_c}</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="options"
                                id={"option_d"}
                                ref={InputRadioD}
                                value={quizData[currentQuestion].option_d}
                            />
                            <label htmlFor={"option_d"}>{quizData[currentQuestion].option_d}</label>
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
