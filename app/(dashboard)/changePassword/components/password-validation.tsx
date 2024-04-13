import { Dispatch, SetStateAction } from "react";

interface PasswordValidationProps{
    hasUppercase: boolean,
    hasLowercase: boolean,
    hasDigit: boolean,
    hasSpecialCharacter: boolean,
    hasMinLength: boolean,
    setValid: Dispatch<SetStateAction<boolean>>
}

const PasswordValidation: React.FC<PasswordValidationProps> = ({
    hasUppercase,
    hasLowercase,
    hasDigit,
    hasSpecialCharacter,
    hasMinLength,
    setValid
}) => {

    if(hasUppercase && hasLowercase && hasDigit && hasSpecialCharacter && hasMinLength){
        setValid(true);
    }

    return(
        <div className="flex justify-center item-center">
            <ul className="list-disc p-4 space-y-2 text-lg font-extrabold">
                <li className={`${hasUppercase ? ' text-gray-600 line-through' : ''}`}>1 uppercase character</li>
                <li className={`${hasLowercase ? ' text-gray-600 line-through' : ''}`}>1 lowercase character</li>
                <li className={`${hasDigit ? ' text-gray-600 line-through' : ''}`}>1 digit character</li>
                <li className={`${hasSpecialCharacter ? ' text-gray-600 line-through' : ''}`}>1 special character</li>
                <li className={`${hasMinLength ? ' text-gray-600 line-through' : ''}`}>Minimum 8 characters</li>
            </ul>
        </div>
    )
}

export default PasswordValidation;