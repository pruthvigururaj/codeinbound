import { useState, useEffect } from "react"

export default function Screen()
{

   
    const [data, setData] = useState([
  { id: 1, qa: "How satisfied are you with our products?", rating: 5 },
  { id: 2, qa: "How fair are the prices compared to similar retailers?", rating: 5 },
  { id: 3, qa: "How satisfied are you with the value for money of your purchase?", rating: 5 },
  { id: 4, qa: "On a scale of 1-10 how would you recommend us to your friends and family?", rating: 10 },
  { id: 5, qa: "What could we do to improve our service?" }
]);

    const [welcome ,setWelcome]=useState(true);
    const [question, setQuestion]=useState(false);
    const [currentindex, setCurrentindex]=useState(0);
    const [textanswers, setTextanswers]=useState("");
    const [qa, setQa]=useState(false);
    const [questionType, setQuestionType] = useState("rating"); // or "text"
    const [newRating, setNewRating] = useState(""); 
    const [newQuestion, setNewQuestion]=useState("");
    const [selectedAnswer, setSelectedAnswer] = useState({});
    const [thankyou, setThankyou]= useState(false);
    
    
    const handelstart=()=>{
      setWelcome(false);
      setQuestion(true);
    }

    const handelnext=()=>{
        if(currentindex<data.length-1)
        {
            setCurrentindex(currentindex+1);
        }
        else
        {
            setThankyou(true);
            setQuestion(false);
        }
    }

    const handelprev=()=>{
        if(currentindex>0)
        {
            setCurrentindex(currentindex-1);
        }
    }

    const handelanswers=(num)=>{
        localStorage.setItem(data[currentindex].id,JSON.stringify(num));
        setSelectedAnswer((prev) => ({ ...prev, [data[currentindex].id]: num }));
    }

    const handeltextans=(e)=>{
        e.preventDefault();
        localStorage.setItem(data[currentindex].id,textanswers)
        setTextanswers("");
    }
    const handeladdqa=(e)=>{
         e.preventDefault();
    const nextId = data.length + 1;

    const newQ = {
      id: nextId,
      qa: newQuestion,
      ...(questionType === "rating" && { rating: parseInt(newRating) })
    };

    setData((prev) => [...prev, newQ]);
    setNewQuestion("");
    setNewRating("");
    setQuestionType("rating");
    setQa(false);
    }
    useEffect(() => {
  if (thankyou) {
    const timer = setTimeout(() => {
    
      localStorage.clear();

    
      setWelcome(true);
      setQuestion(false);
      setThankyou(false);
      setCurrentindex(0);
      setSelectedAnswer({});
    }, 5000); 

    return () => clearTimeout(timer); 
  }
}, [thankyou]);
    
    return(
        <div className="bg-amber-300 w-full h-screen flex justify-center items-center">
            <div >
                 {welcome && (<div className="border border-black p-6">
                    <h1 className="text-center text-4xl">Welcome Customer</h1> 


                     <div className="flex justify-around py-4">
                        <button onClick={handelstart} className="px-4 py-2 text-xl bg-green-600 text-white rounded-md font-semibold cursor-pointer">Start</button>
                        <button onClick={()=>setQa(true)} className="px-4 py-2 text-xl bg-blue-600 text-white rounded-md font-semibold cursor-pointer">ADD Question</button>
                     </div>
                     
                     {qa && (<div >
                       <form onSubmit={handeladdqa} className="flex flex-col">
                         <input
                           type="text"
                           placeholder="Enter your question"
                           value={newQuestion}
                           onChange={(e) => setNewQuestion(e.target.value)}
                           required
                           className="bg-white py-3  rounded-md pl-2 outline-none mb-3"
                         />

                         <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="bg-white py-3 rounded-md outline-none mb-3">
                          <option value="rating">Rating</option>
                          <option value="text">Text</option>
                         </select>

                       {questionType === "rating" && (
                           <input
                             type="number"
                             placeholder="Max rating (e.g. 5 or 10)"
                             value={newRating}
                             onChange={(e) => setNewRating(e.target.value)}
                             className="bg-white py-3 rounded-md outline-none mb-3 pl-2"
                             required
                           />
                       )}

                      <button type="submit" className="px-4 py-2 text-xl bg-green-600 text-white rounded-md font-semibold cursor-pointer">Save</button>
                      
                      </form>

                    </div>)
                
                }    
                </div>)}
            </div>


            <div >
                {question && (<div className="border border-black p-6">
                    <h1 className="text-center text-2xl font-semibold mb-3">Question {currentindex+1}/{data.length}</h1>
                    <h1 className="text-center text-2xl font-semibold mb-3">{data[currentindex].qa}</h1>
                    
                 <div className="flex flex-row gap-2">
                    {Array.from({ length: data[currentindex].rating }, (_, i) => {
                        const value = i + 1;
                        const isSelected = selectedAnswer[data[currentindex].id] === value;

                    return (
                      <button
                         key={i}
                         onClick={() => handelanswers(value)}
                         className={`px-4 py-2 rounded ${
                         isSelected ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                     >
                   {value}
                   </button>
                     );
                   })}
                  </div>

                  {!data[currentindex].rating && (
                    <div>
                        <form onSubmit={handeltextans} className="flex flex-col gap-4">
                        <input
                        value={textanswers}
                        onChange={(e)=>{setTextanswers(e.target.value)}}
                        placeholder="Please enter the query...." 
                        className="bg-white py-3 pl-2 rounded-md outline-none">
                        
                        </input>
                        <button  className="px-4 py-2 text-xl bg-green-600 text-white rounded-md font-semibold cursor-pointer">Submit</button>
                        </form>
                    </div>    
                  )}

                        
                        <div className="flex justify-between mt-3">
                           
                            <button onClick={handelprev}  className="px-4 py-2 text-xl bg-green-800 text-white rounded-md font-semibold cursor-pointer">Previous</button>
                            <button onClick={handelnext}  className="px-4 py-2 text-xl bg-cyan-900 text-white rounded-md font-semibold cursor-pointer">Next</button>
                        </div>


                    </div>)}
                    
            </div>
            {thankyou && (
                <div>
                    <h1 className="text-4xl">Thank you</h1>
                </div>    
            )}
        </div>
    )
}