"use client";

import { useState, useEffect } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Line } from 'react-chartjs-2';
import {
  ChartOptions,
  ChartData,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { FileUp, Save, Trash, RotateCcw } from 'lucide-react';
import Navbar from '@/components/ui/NavBar';
import { Chart as ChartJS } from 'chart.js';
import NavBar from '@/components/ui/NavBar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Home() {
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: Array.from({ length: 100 }, (_, i) => `Label ${i + 1}`),
    datasets: [
      {
        label: 'Real-time Data',
        data: Array.from({ length: 100 }, () => Math.floor(Math.random() * 100)),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        fill: false,
      },
    ],
  });

  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Real-time Data',
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          display: true,
        },
      },
    },
    animation: {
      duration: 1000,
    },
  });

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prevLogs) => [
      ...prevLogs,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const updateChartData = (newData: number | Partial<typeof chartData.datasets[0]>) => {
    setChartData((prevData) => {
      if (typeof newData === 'number') {
        const currentTime = new Date().toLocaleTimeString();
        const updatedData = [...(prevData.datasets[0].data || []), newData].slice(-100);
        const updatedLabels = [...(prevData.labels || []), currentTime].slice(-100);
        return {
          ...prevData,
          labels: updatedLabels,
          datasets: [{ ...prevData.datasets[0], data: updatedData }],
        };
      } else {
        return {
          ...prevData,
          datasets: [{ ...prevData.datasets[0], ...newData }],
        };
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = Math.floor(Math.random() * 100);
      updateChartData(newData);
      addLog('Data updated in real-time');
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const [userInput, setUserInput] = useState('');

  const handleUserInput = () => {
    if (userInput.trim()) {
      addLog(userInput);
      setUserInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
<NavBar/>
      <ResizablePanelGroup direction="vertical" className="flex-grow">
        <ResizablePanel defaultSize={75}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={75}>
              <div className="p-4 h-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={25}>
              <div className="p-4 h-full flex flex-col space-y-4">
                <Button onClick={() => addLog('File uploaded')} className="w-full">
                  <FileUp className="mr-2 h-4 w-4" /> Upload
                </Button>
                <Button onClick={() => addLog('Data saved')} className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button
                  onClick={() => addLog('Data cleared')}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash className="mr-2 h-4 w-4" /> Clear
                </Button>
                <Button onClick={() => addLog('Data reset')} variant="outline" className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
                <ScrollArea className="flex-grow border rounded-md p-2">
                  {logs.map((log, index) => (
                    <div key={index} className="text-sm">
                      {log}
                    </div>
                  ))}
                </ScrollArea>
                <div className="flex space-x-2">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter log message"
                    className="flex-grow"
                  />
                  <Button onClick={handleUserInput} className="w-full">
                    Add Log
                  </Button>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25}>
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="data">Data</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="chart-type">Chart Type</Label>
                    <Select onValueChange={(value) => addLog(`Chart type changed to ${value}`)}>
                      <SelectTrigger id="chart-type">
                        <SelectValue placeholder="Select chart type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Line</SelectItem>
                        <SelectItem value="bar">Bar</SelectItem>
                        <SelectItem value="pie">Pie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chart-title">Chart Title</Label>
                    <Input
                      id="chart-title"
                      defaultValue="Real-time Data"
                      onChange={(e) => {
                        setChartOptions((prev) => ({
                          ...prev,
                          plugins: {
                            ...(prev.plugins ?? {}),
                            title: {
                              ...(prev.plugins?.title ?? {}),
                              text: e.target.value,
                            },
                          },
                        }));
                        addLog(`Chart title changed to ${e.target.value}`);
                      }}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="appearance" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="line-color">Line Color</Label>
                    <Input
                      id="line-color"
                      type="color"
                      defaultValue="#4bc0c0"
                      onChange={(e) => {
                        updateChartData({ borderColor: e.target.value });
                        addLog(`Line color changed to ${e.target.value}`);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fill-color">Fill Color</Label>
                    <Input
                      id="fill-color"
                      type="color"
                      defaultValue="#4bc0c0"
                      onChange={(e) => {
                        updateChartData({ backgroundColor: e.target.value });
                        addLog(`Fill color changed to ${e.target.value}`);
                      }}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="fill-area"
                      onCheckedChange={(checked) => {
                        updateChartData({ fill: checked });
                        addLog(`Fill area ${checked ? 'enabled' : 'disabled'}`);
                      }}
                    />
                    <Label htmlFor="fill-area">Fill Area</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="line-tension">Line Tension</Label>
                    <Slider
                      id="line-tension"
                      min={0}
                      max={1}
                      step={0.1}
                      defaultValue={[0.1]}
                      onValueChange={(value) => {
                        updateChartData({ tension: value[0] });
                        addLog(`Line tension changed to ${value[0]}`);
                      }}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="data" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="data-range">Data Range</Label>
                    <Slider
                      id="data-range"
                      min={1}
                      max={12}
                      step={1}
                      defaultValue={[10]}
                      onValueChange={(value) => {
                        const newLabels = Array.from({ length: value[0] }, (_, i) => `Label ${i + 1}`);
                        const newData = Array.from({ length: value[0] }, () => Math.floor(Math.random() * 100));
                        setChartData((prev) => ({
                          ...prev,
                          labels: newLabels,
                          datasets: [{ ...prev.datasets[0], data: newData }],
                        }));
                        addLog(`Data range changed to ${value[0]}`);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-value">Min Value</Label>
                    <Input
                      id="min-value"
                      type="number"
                      defaultValue={0}
                      onChange={(e) => {
                        setChartOptions((prev) => ({
                          ...prev,
                          scales: {
                            ...prev.scales,
                            y: {
                              ...prev.scales?.y,
                              min: Number(e.target.value),
                            },
                          },
                        }));
                        addLog(`Min value changed to ${e.target.value}`);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-value">Max Value</Label>
                    <Input
                      id="max-value"
                      type="number"
                      defaultValue={100}
                      onChange={(e) => {
                        setChartOptions((prev) => ({
                          ...prev,
                          scales: {
                            ...prev.scales,
                            y: {
                              ...prev.scales?.y,
                              max: Number(e.target.value),
                            },
                          },
                        }));
                        addLog(`Max value changed to ${e.target.value}`);
                      }}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="advanced" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-legend"
                      defaultChecked
                      onCheckedChange={(checked) => {
                        setChartOptions((prev) => ({
                          ...prev,
                          plugins: {
                            ...(prev.plugins ?? {}),
                            legend: {
                              ...(prev.plugins?.legend ?? {}),
                              display: checked,
                            },
                          },
                        }));
                        addLog(`Legend ${checked ? 'shown' : 'hidden'}`);
                      }}
                    />
                    <Label htmlFor="show-legend">Show Legend</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-grid"
                      defaultChecked
                      onCheckedChange={(checked) => {
                        setChartOptions((prev) => ({
                          ...prev,
                          scales: {
                            ...prev.scales,
                            x: {
                              ...prev.scales?.x,
                              grid: {
                                ...prev.scales?.x?.grid,
                                display: checked,
                              },
                            },
                            y: {
                              ...prev.scales?.y,
                              grid: {
                                ...prev.scales?.y?.grid,
                                display: checked,
                              },
                            },
                          },
                        }));
                        addLog(`Grid ${checked ? 'shown' : 'hidden'}`);
                      }}
                    />
                    <Label htmlFor="show-grid">Show Grid</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="animation-duration">Animation Duration (ms)</Label>
                    <Input
                      id="animation-duration"
                      type="number"
                      defaultValue={1000}
                      onChange={(e) => {
                        setChartOptions((prev) => ({
                          ...prev,
                          animation: {
                            ...prev.animation,
                            duration: Number(e.target.value),
                          },
                        }));
                        addLog(`Animation duration changed to ${e.target.value}ms`);
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
