

// create IPatient Interface
interface IPatient{
  [x: string]: any;
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    tokens: Array<Object>,
    profile_pic: string,
    dob: Date,
    phone_code: string,
    phone_number: string,
    id_proof: Array<string>,
    language: string,
    currency: string,
    gender: string,
    city: string,
    state: string,
    country: string,
    postalcode: string,
	address: string,
	emargency_contact: string,
	known_language: Array<string>,
	property_likeds: Array<string>,
	social_login_id: string,
	social_auth_token: string,
	facebook_connect_id: string,
	facebook_connect_token: string,
	google_connect_id: string,
	google_connect_token: string,
	description: string,
	verify_phone: boolean,
	verify_email: boolean,
	is_verified: boolean,
	verified: boolean,
	add_payout: boolean,
	host_user: boolean,
	review_count: number,
	login_via_facebook: boolean,
	login_via_google: boolean,
	login_via_linkedin: boolean,
	created_at: Date,
	updated_at: Date,
	forget_pwd_token: Array<string>,
	forget_pwd_token_expired_on: Date,
	
	resetlink: string,
}


export default IPatient;