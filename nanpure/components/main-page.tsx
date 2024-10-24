'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Pencil, Eraser, HelpCircle, User, BookOpen, Clock, BarChart2 } from 'lucide-react'

type CellValue = number | null;
type SudokuGrid = CellValue[][];

const initialGrid: SudokuGrid = Array(9).fill(null).map(() => Array(9).fill(null));

export function MainPage() {
  const [grid, setGrid] = useState<SudokuGrid>(initialGrid);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [difficulty, setDifficulty] = useState<string>("1");
  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [memoMode, setMemoMode] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell([row, col]);
  };

  const handleNumberInput = (number: number) => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      const newGrid = [...grid];
      newGrid[row][col] = number;
      setGrid(newGrid);
      updateProgress(newGrid);
    }
  };

  const updateProgress = (newGrid: SudokuGrid) => {
    const filledCells = newGrid.flat().filter(cell => cell !== null).length;
    const totalCells = 81;
    setProgress((filledCells / totalCells) * 100);
  };

  const generateNewPuzzle = () => {
    // ここでAIによるパズル生成ロジックを呼び出す
    // 仮のロジックとして、ランダムな数字を配置
    const newGrid: SudokuGrid = Array(9).fill(null).map(() => 
      Array(9).fill(null).map(() => Math.random() > 0.7 ? Math.floor(Math.random() * 9) + 1 : null)
    );
    setGrid(newGrid);
    setTimer(0);
    setIsRunning(true);
    updateProgress(newGrid);
  };

  return (
    <div className="min-h-screen bg-[#F8F8FF] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">ナンプレAI生成サイト</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>難易度設定</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="難易度を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1 (超初級)</SelectItem>
                  <SelectItem value="2">Level 2 (初級)</SelectItem>
                  <SelectItem value="3">Level 3 (中級)</SelectItem>
                  <SelectItem value="4">Level 4 (上級)</SelectItem>
                  <SelectItem value="5">Level 5 (超上級)</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full mt-2" onClick={generateNewPuzzle}>新しいパズルを生成</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>タイマー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono text-center">{formatTime(timer)}</div>
              <div className="flex justify-center mt-2">
                <Button variant="outline" size="icon" onClick={() => setIsRunning(!isRunning)}>
                  <Clock className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>進捗</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="w-full" />
              <div className="mt-2 text-center">{Math.round(progress)}% 完了</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardContent className="p-4">
              <div className="grid grid-cols-9 gap-1 aspect-square">
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`border ${
                        rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2' : ''
                      } ${
                        colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2' : ''
                      } ${
                        selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
                          ? 'bg-blue-200'
                          : 'bg-white'
                      } flex items-center justify-center text-2xl font-bold cursor-pointer`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>操作パネル</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                  <Button key={number} onClick={() => handleNumberInput(number)}>
                    {number}
                  </Button>
                ))}
              </div>
              <div className="flex justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setMemoMode(!memoMode)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{memoMode ? 'メモモードON' : 'メモモードOFF'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Eraser className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>消去</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>ヒント</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>学習支援</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full mb-2">
                <BookOpen className="mr-2 h-4 w-4" /> チュートリアル
              </Button>
              <Button variant="outline" className="w-full">
                <HelpCircle className="mr-2 h-4 w-4" /> 解法テクニック
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>統計情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>平均解答時間: 12:34</div>
                <div>難易度別クリア率: 75%</div>
                <Button variant="outline" className="w-full">
                  <BarChart2 className="mr-2 h-4 w-4" /> 詳細統計
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ユーザー機能</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full mb-2">
                <User className="mr-2 h-4 w-4" /> プロフィール
              </Button>
              <Button variant="outline" className="w-full">
                お気に入り問題
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}