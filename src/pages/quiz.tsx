import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {BASE_URL} from "../constants";
import {Option, Question, Result} from "../components";


export const Quiz = () => {
  
// Extract the 'id' from the URL parameters using React Router.
  const { id } = useParams();

  // Initialize state variables to manage quiz data and progress.
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [correctOptionId, setCorrectOptionId] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Use the 'useEffect' hook to fetch quiz questions when the component mounts.
  useEffect(() => {
    const getQuiz = async () => {
      const response = await fetch(`${BASE_URL}/quiz/${id}`).then((response) =>
        response.json()
      );
      setQuestions(response.questions);
    };
    getQuiz();
  }, []); // The empty dependency array ensures this effect runs only once.
  
  // Function to handle option selection and check correctness.
  const onSelectOption = async (questionId: string, optionId: string) => {
    setSelectedOptionId(optionId);
    const response = await fetch(
      `${BASE_URL}/quiz/${id}/question/${questionId}`
    ).then((response) => response.json());

    setCorrectOptionId(response.correctOption);
    if (optionId === response.correctOption) {
      setCorrectCount(correctCount + 1);
    }
  };

  // Get the currently selected question.
  const selectedQuestion = questions[selectedQuestionIndex];

  // If no question is available, return an empty fragment.
  if (!selectedQuestion) {
    return <></>;
  }

  // Function to move to the next question.
  const next = () => {
    if (selectedQuestionIndex < questions.length - 1) {
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
      setSelectedOptionId("");
      setCorrectOptionId("");
    }
  };

  // Function to finish the quiz.
  const finish = () => {
    setIsFinished(true);
  };

  // If the quiz is finished, display the result.
  if (isFinished) {
    return <Result correct={correctCount} total={questions.length} />;
  }

  // Render the current question and options.
  return (
      <div className="p-4 w-full md:w-96 m-auto">
        <Question
            key={selectedQuestion.id}
            id={selectedQuestion.id}
            label={selectedQuestion.label}
            selectedOption={selectedOptionId}
            onSelectOption={onSelectOption}
            correctOption={correctOptionId}
        >
          {selectedQuestion.options.map((option) => {
            return (
                <Option key={option.id} id={option.id}>
                  {option.label}
                </Option>
            );
          })}
        </Question>

        {selectedQuestionIndex < questions.length - 1 ? (
            <button onClick={next} disabled={!selectedOptionId}>
              Next
            </button>
        ) : (
            <button onClick={finish} disabled={!selectedOptionId}>
              Finish
            </button>)
        }
      </div>
  );


};
