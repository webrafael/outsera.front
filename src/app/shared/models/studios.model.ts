export interface Studios {
    studios: StudioWinner[];
}

export interface StudioWinner {
    name: string;
    winCount: number;
}

export interface StudiosParams {
    projection: 'studios-with-win-count';
}