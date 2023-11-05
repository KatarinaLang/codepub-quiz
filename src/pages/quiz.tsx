import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {BASE_URL} from "../constants";
import {Option, Question, Result} from "../components";


export const Quiz = () => {
  const {id} = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [correctOptionId, setCorrectOptionId] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    const getQuiz = async () => {
      const response = await fetch(`${BASE_URL}/quiz/${id}`).then((response) =>
          response.json()
      );
      setQuestions(response.Item.questions);
    };
    getQuiz();

  }, []);
  const onSelectOption = async (questionId: string, optionId: string) => {
    setSelectedOptionId(optionId);
    const response = await fetch(
        `${BASE_URL}/quiz/${id}/question/${questionId}`
    ).then((response) => response.json());
    console.log(response.Items[0].questions[questionId].correctOption)
    setCorrectOptionId(response.Items[0].questions[questionId].correctOption);
    if (optionId === response.Items[0].questions[questionId].correctOption) {
      setCorrectCount(correctCount + 1);
    }
  };

  const selectedQuestion = questions[selectedQuestionIndex];

  if (!selectedQuestion) {
    return <></>;
  }

  const next = () => {
    if (selectedQuestionIndex < questions.length - 1) {
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
      setSelectedOptionId("");
      setCorrectOptionId("");
    }
  };

  const finish = () => {
    setIsFinished(true);
  };

  if (isFinished) {
    return <Result correct={correctCount} total={questions.length} />;
  }

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
