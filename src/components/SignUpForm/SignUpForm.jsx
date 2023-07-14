import { Component } from 'react'
import { signUp } from '../../utilities/users-service'

export default class SignUpForm extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        confirm: '',
        error: ''
    }

    handleChange = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value,
            error: ''
        })
    }

    handleSubmit = async (evt) => {
        evt.preventDefault()
        try {
            const formData = {...this.state}
            delete formData.error
            delete formData.confirm

            const user = await signUp(formData)
            this.props.setUser(user)
        }
        catch {
            this.setState({ error: 'Sign Up Failed - Try Again' })
        }
    }

    render() {
    const disable = this.state.password !== this.state.confirm
    return (
        <div>
            <div className="container">
                <div className='card green darken-4'>
                    <div className='card-content'>
                        <form autoComplete="off" onSubmit={this.handleSubmit}>
                            <label className='white-text'>Name</label>
                            <input className='white-text' type="text" name="name" value={this.state.name} onChange={this.handleChange} required />
                            <label className='white-text'>Email</label>
                            <input className='white-text' type="email" name="email" value={this.state.email} onChange={this.handleChange} required />
                            <label className='white-text'>Password</label>
                            <input className='white-text' type="password" name="password" value={this.state.password} onChange={this.handleChange} required />
                            <label className='white-text'>Confirm</label>
                            <input className='white-text' type="password" name="confirm" value={this.state.confirm} onChange={this.handleChange} required />
                            <button className='waves-effect waves-light btn-large red' type="submit" disabled={disable}>SIGN UP</button>
                        </form>
                    </div>
                </div>
            </div>
            <p className="error-message">&nbsp;{this.state.error}</p>
        </div>
    );
    }      
}