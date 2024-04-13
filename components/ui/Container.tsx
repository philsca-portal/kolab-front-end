interface ContainerProps{
    children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
    children
}) => {
    return(
        <div className="mx-8">
            {children}
        </div>
    )
}

export default Container;