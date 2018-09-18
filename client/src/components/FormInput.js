import React, { Component } from 'react';

const FormInput = ({type,required,message,warning}) => (
    <div className="form-item">
        {type === "textarea" ? (
            <textarea></textarea>
        ) : (
            <input type={type} />
        )}
        {required && type !== "submit" &&
        <div className="form-item__message">{message}</div>}
    </div>
);
export default FormInput;
