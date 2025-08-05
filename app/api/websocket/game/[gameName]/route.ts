import { NextRequest, NextResponse } from 'next/server';
import { GameService, GameResponse } from '@/lib/services/GameService';

// DELETE - Delete game
export async function DELETE(
  request: NextRequest,
  { params }: { params: { gameName: string } }
) {
  try {
    const { gameName } = params;
    // Validate required parameters
    if (!gameName) {
      return NextResponse.json(
        GameResponse.badRequest('Game name is required'),
        { status: 400 }
      );
    }

    // Get query parameters for deletion options
    const url = new URL(request.url);
    const deleteFiles = url.searchParams.get('deleteFiles') === 'true';
    const deleteHistory = url.searchParams.get('deleteHistory') !== 'false'; // default true
    const deleteCache = url.searchParams.get('deleteCache') !== 'false'; // default true
    const deleteRelatedData = url.searchParams.get('deleteRelatedData') !== 'false'; // default true

    console.log(`Delete game request: ${gameName}`, {
      deleteFiles,
      deleteHistory,
      deleteCache,
      deleteRelatedData
    });

    // Call service layer
    const result = await GameService.deleteGame(gameName, {
      deleteFiles,
      deleteHistory,
      deleteCache,
      deleteRelatedData
    });

    return NextResponse.json(
      GameResponse.success(result, `Game ${gameName} deleted successfully`),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting game:', error);
    
    return NextResponse.json(
      GameResponse.error(
        error instanceof Error ? error.message : 'Delete failed',
        { gameName: params.gameName }
      ),
      { status: 500 }
    );
  }
}

// GET - Get game information
export async function GET(
  request: NextRequest,
  { params }: { params: { gameName: string } }
) {
  try {
    const { gameName } = params;
        console.log('gameName',gameName)

    if (!gameName) {
      return NextResponse.json(
        GameResponse.badRequest('Game name is required'),
        { status: 400 }
      );
    }

    console.log(`Get game request: ${gameName}`);

    // Call service layer
    const result = await GameService.getGame(gameName);

    return NextResponse.json(
      GameResponse.success(result.data, `Game ${gameName} retrieved successfully`),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error getting game:', error);
    
    return NextResponse.json(
      GameResponse.error(
        error instanceof Error ? error.message : 'Get failed',
        { gameName: params.gameName }
      ),
      { status: 500 }
    );
  }
}

// PUT - Update game
export async function PUT(
  request: NextRequest,
  { params }: { params: { gameName: string } }
) {
  try {
    const { gameName } = params;
    
    if (!gameName) {
      return NextResponse.json(
        GameResponse.badRequest('Game name is required'),
        { status: 400 }
      );
    }

    // Get request body
    const updateData = await request.json();

    console.log(`Update game request: ${gameName}`, updateData);

    // Call service layer
    const result = await GameService.updateGame(gameName, updateData);

    return NextResponse.json(
      GameResponse.success(result.data, result.message),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating game:', error);
    
    return NextResponse.json(
      GameResponse.error(
        error instanceof Error ? error.message : 'Update failed',
        { gameName: params.gameName }
      ),
      { status: 500 }
    );
  }
}