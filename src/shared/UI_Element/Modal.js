import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';

import classes from './Modal.module.css';

const ModalOverlay = props => {
	const content = (
		<div className={`${classes.Modal} ${props.ContainerClass}`} style={props.style}>
			<header className={`${classes.Header} ${props.HeaderClass}`}>
				<h2>{props.HeaderText}</h2>
			</header>
			<form onSubmit={props.OnSubmit ? props.onSubmit : e => e.preventDefault()}>
				<div className={`${classes.Content} ${props.ContentClass}`}>{props.children}</div>
				<footer className={`${classes.Footer} ${props.FooterClass}`}>{props.FooterText}</footer>
			</form>
		</div>
	);
	return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

const Modal = props => {
	return (
		<React.Fragment>
			{props.show && <Backdrop onClick={props.onCancel} />}
			<CSSTransition in={props.show} mountOnEnter unmountOnExit timeout={200} classNames='Modal'>
				<ModalOverlay {...props} />
			</CSSTransition>
		</React.Fragment>
	);
};

export default Modal;
