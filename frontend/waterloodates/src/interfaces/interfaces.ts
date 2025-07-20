export interface UserData {
    _id?: string;
    family_name?: string;
    given_name?: string;
    name?: string;
    email?: string;
    email_verified?: boolean;
    rizzume_created: boolean;
    wingman_created: boolean;
    picture?: string;
    nickname?: string;
    sub: string;
    user_id: string;
}

export interface ReceiveRizzume {
    _id?: string;
    user_id?: string;
    fun_stuff?: {
        blurb?: string;
        fun_fact?: string;
        hobbies?: string;
    };
    job?: {
        currentjob?: string;
        workterm?: number;
    };
    profile?: {
        age?: number;
        gender?: string;
        sexuality?: string;
        pfp_url?: string;
        name?: {
            first?: string;
            middle?: string;
            last?: string;
        };
    };
}

export interface SendWingman {
  user_id?: string;
  questions_and_desired_answers?: {
    question?: string;
    desired_answer?: string;
  }[];
}