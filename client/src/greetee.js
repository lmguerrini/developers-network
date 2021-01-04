export default function Greetee(props) {
    //console.log("props in Greetee:", props);
    return<span>{props.name || "AWESOME_USER"}</span>;
}

/* 
you can also destructure your props! just make sure you always confirm that you're receiving the information first!
export default function Greetee({ name }) {
    console.log("props in Greetee:", props);
    return <span>{name || "SUPER_AWESOME_USER"}</span>;
} 
*/