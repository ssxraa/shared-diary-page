import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function POST({ request }) {
    try {
        const { username, password } = await request.json();

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('diary_id')
            .eq('username', username)
            .single();

        if (userError) throw userError;
        
        const { data: diary, error: diaryError } = await supabase
            .from('diaries')
            .select('id')
            .eq('id', user.diary_id)
            .eq('password', password)
            .single();

        if (diaryError) throw diaryError;

        return json({ 
            success: true, 
            user: username,
            diary_id: diary.id 
        });

    } catch (error) {
        console.error('Login error:', error);
        return json({ error: 'Invalid credentials' }, { status: 401 });
    }
}