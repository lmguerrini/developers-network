import Greetee from "./greetee";
import Counter from "./counter";

//"functional component" (beacuse it's a function)
// whose job is only to render information (they cannot have state)
// can return only 1 parent element
// error displayed 2nd terminal screen (npm run dev:client)
// className = class (for JS)
export default function HelloWorld() {
    const nameVar = "Lorenzo";
    return (
        //NB: return only one parent component
        // name = property of props
        // nameVar = value
        // =>props in greetee.js is going to take those infos
        <div className="newClass">
            <div>
                Hello <Greetee name={nameVar} />
            </div>
            <div>
                Hello <Greetee name="Jasmine" />
            </div>
            <div>
                Hello <Greetee />
            </div>
            <Counter />
        </div>
    );
}

//props = information passed down from parent to children
