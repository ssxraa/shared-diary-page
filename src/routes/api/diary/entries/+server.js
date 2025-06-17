import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET({ url }) {
    try {
        const diary_id = url.searchParams.get('diary_id');
        
        const { data, error } = await supabase
            .from('entries')
            .select('*')
            .eq('diary_id', diary_id)
            .order('timestamp', { ascending: true });

        if (error) throw error;

        return json(data);

    } catch (error) {
        console.error('Error fetching entries:', error);
        return json({ error: 'Failed to fetch entries' }, { status: 500 });
    }
}

export async function POST({ request }) {
    try {
        const { diary_id, author, content } = await request.json();

        const { data, error } = await supabase
            .from('entries')
            .insert([
                { diary_id, author, content }
            ])
            .select()
            .single();

        if (error) throw error;

        return json(data);

    } catch (error) {
        console.error('Error adding entry:', error);
        return json({ error: 'Failed to add entry' }, { status: 500 });
    }
}

export async function PATCH({ request }) {
    try {
        const { diary_id, author, content } = await request.json();

        const { data: lastEntry, error: fetchError } = await supabase
            .from('entries')
            .select('*')
            .eq('diary_id', diary_id)
            .eq('author', author)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single();

        if (fetchError) throw fetchError;


        const { data, error: updateError } = await supabase
            .from('entries')
            .update({ 
                content,
                is_edited: true,
                last_edited_at: new Date().toISOString()
            })
            .eq('id', lastEntry.id)
            .select()
            .single();

        if (updateError) throw updateError;

        return json(data);
    } catch (error) {
        console.error('Edit entry error:', error);
        return json({ error: 'Failed to edit entry' }, { status: 500 });
    }
}

export async function DELETE({ url }) {
    try {
        const diary_id = url.searchParams.get('diary_id');
        const author = url.searchParams.get('author');


        const { data: lastEntry, error: fetchError } = await supabase
            .from('entries')
            .select('*')
            .eq('diary_id', diary_id)
            .eq('author', author)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single();

        if (fetchError) throw fetchError;

        // Delete the entry
        const { error: deleteError } = await supabase
            .from('entries')
            .delete()
            .eq('id', lastEntry.id);

        if (deleteError) throw deleteError;

        return json({ success: true });
    } catch (error) {
        console.error('Delete entry error:', error);
        return json({ error: 'Failed to delete entry' }, { status: 500 });
    }
}