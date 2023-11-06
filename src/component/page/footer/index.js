function Footer(props){
    return (
        <div style={{position: "absolute", bottom : 0, background :"silver", width:"100vw", color:"black", fontFamily:"sans-serif"}}>
        <tr>{props.children}</tr>
        </div>
    )
}

export default Footer;