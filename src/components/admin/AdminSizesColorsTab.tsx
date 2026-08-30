import React, { useState } from 'react';
import { 
  Ruler, 
  Palette, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Save, 
  X,
  Layers,
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { ProductColor, CategorySizeChart, SizeChartRow } from '../../types';
import { AdminStoreService, DEFAULT_COLORS, DEFAULT_MASTER_SIZES } from '../../services/adminStoreService';

interface AdminSizesColorsTabProps {
  onRefresh: () => void;
  adminName: string;
}

export const AdminSizesColorsTab: React.FC<AdminSizesColorsTabProps> = ({
  onRefresh,
  adminName
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sizes' | 'charts' | 'colors'>('sizes');
  const [masterSizes, setMasterSizes] = useState<string[]>(AdminStoreService.getSizes());
  const [colors, setColors] = useState<ProductColor[]>(AdminStoreService.getColors());
  const [sizeCharts, setSizeCharts] = useState<CategorySizeChart[]>(AdminStoreService.getSizeCharts());

  // Size Form State
  const [newSizeInput, setNewSizeInput] = useState('');
  const [editingSizeIndex, setEditingSizeIndex] = useState<number | null>(null);
  const [editingSizeValue, setEditingSizeValue] = useState('');

  // Color Form State
  const [newColorName, setNewColorName] = useState('');
  const [newColorNameBn, setNewColorNameBn] = useState('');
  const [newColorHex, setNewColorHex] = useState('#1e293b');
  const [editingColorIndex, setEditingColorIndex] = useState<number | null>(null);
  const [editingColorName, setEditingColorName] = useState('');
  const [editingColorNameBn, setEditingColorNameBn] = useState('');
  const [editingColorHex, setEditingColorHex] = useState('#1e293b');

  // Chart Edit Modal
  const [editingChartIndex, setEditingChartIndex] = useState<number | null>(null);
  const [newRowSize, setNewRowSize] = useState('M');
  const [newRowChest, setNewRowChest] = useState(40);
  const [newRowLength, setNewRowLength] = useState(28.5);
  const [newRowShoulder, setNewRowShoulder] = useState(17.5);
  const [newRowFit, setNewRowFit] = useState('60-70 kg');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // --- SIZES CRUD ---
  const handleAddSize = () => {
    if (!newSizeInput.trim()) return;
    const clean = newSizeInput.trim().toUpperCase();
    if (masterSizes.includes(clean)) {
      showToast(`Size "${clean}" already exists.`);
      return;
    }
    const updated = [...masterSizes, clean];
    setMasterSizes(updated);
    AdminStoreService.saveSizes(updated);
    setNewSizeInput('');
    showToast(`Size "${clean}" added to master palette.`);
    onRefresh();
  };

  const handleSaveEditedSize = (idx: number) => {
    if (!editingSizeValue.trim()) return;
    const clean = editingSizeValue.trim().toUpperCase();
    const updated = [...masterSizes];
    updated[idx] = clean;
    setMasterSizes(updated);
    AdminStoreService.saveSizes(updated);
    setEditingSizeIndex(null);
    showToast(`Size updated to "${clean}".`);
    onRefresh();
  };

  const handleDeleteSize = (sz: string) => {
    const updated = masterSizes.filter(s => s !== sz);
    setMasterSizes(updated);
    AdminStoreService.saveSizes(updated);
    showToast(`Size "${sz}" removed.`);
    onRefresh();
  };

  const handleMoveSize = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === masterSizes.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...masterSizes];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setMasterSizes(updated);
    AdminStoreService.saveSizes(updated);
    onRefresh();
  };

  // --- COLORS CRUD ---
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    const newCol: ProductColor = {
      name: newColorName.trim(),
      nameBn: newColorNameBn.trim() || newColorName.trim(),
      hex: newColorHex
    };
    const updated = [...colors, newCol];
    setColors(updated);
    AdminStoreService.saveColors(updated);
    setNewColorName('');
    setNewColorNameBn('');
    showToast(`Color "${newCol.name}" added to master swatch.`);
    onRefresh();
  };

  const handleSaveEditedColor = (idx: number) => {
    if (!editingColorName.trim()) return;
    const updated = [...colors];
    updated[idx] = {
      name: editingColorName.trim(),
      nameBn: editingColorNameBn.trim() || editingColorName.trim(),
      hex: editingColorHex
    };
    setColors(updated);
    AdminStoreService.saveColors(updated);
    setEditingColorIndex(null);
    showToast(`Color "${editingColorName}" updated.`);
    onRefresh();
  };

  const handleDeleteColor = (idx: number) => {
    const updated = colors.filter((_, i) => i !== idx);
    setColors(updated);
    AdminStoreService.saveColors(updated);
    showToast('Color swatch removed.');
    onRefresh();
  };

  const handleMoveColor = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === colors.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...colors];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setColors(updated);
    AdminStoreService.saveColors(updated);
    onRefresh();
  };

  // --- SIZE CHARTS CRUD ---
  const handleAddChartRow = (chartIdx: number) => {
    const updated = [...sizeCharts];
    const newRow: SizeChartRow = {
      size: newRowSize,
      chestInches: newRowChest,
      chestCm: Math.round(newRowChest * 2.54),
      lengthInches: newRowLength,
      lengthCm: Math.round(newRowLength * 2.54),
      shoulderInches: newRowShoulder,
      shoulderCm: Math.round(newRowShoulder * 2.54),
      sleeveInches: 24,
      sleeveCm: 61,
      recommendedWeightKg: newRowFit || '55-75 kg',
      recommendedHeightFt: "5'5\" - 5'10\""
    };
    updated[chartIdx].chartRows.push(newRow);
    setSizeCharts(updated);
    AdminStoreService.saveSizeCharts(updated);
    showToast(`Row for size "${newRowSize}" added to chart.`);
    onRefresh();
  };

  const handleDeleteChartRow = (chartIdx: number, rowIdx: number) => {
    const updated = [...sizeCharts];
    updated[chartIdx].chartRows.splice(rowIdx, 1);
    setSizeCharts(updated);
    AdminStoreService.saveSizeCharts(updated);
    showToast('Row removed from chart.');
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-stone-950 font-sans">Sizes, Measurements &amp; Color Palettes</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage global product size offerings, interactive size guide charts, and color swatches.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('sizes')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'sizes' ? 'bg-white text-stone-950 shadow-xs font-black' : 'text-stone-600'
            }`}
          >
            Sizes ({masterSizes.length})
          </button>
          <button
            onClick={() => setActiveSubTab('charts')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'charts' ? 'bg-white text-stone-950 shadow-xs font-black' : 'text-stone-600'
            }`}
          >
            Size Guide Charts ({sizeCharts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('colors')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'colors' ? 'bg-white text-stone-950 shadow-xs font-black' : 'text-stone-600'
            }`}
          >
            Colors ({colors.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: MASTER SIZES */}
      {activeSubTab === 'sizes' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-sm font-black text-stone-900">Standard Garment Sizes</h3>
              <p className="text-xs text-stone-500">Available across all garment creation forms and product filters.</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. 4XL, Free Size"
                value={newSizeInput}
                onChange={(e) => setNewSizeInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddSize(); }}
                className="px-3 py-1.5 border border-stone-200 rounded-xl text-xs font-mono font-bold focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <button
                onClick={handleAddSize}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Size</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {masterSizes.map((sz, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50 group hover:border-amber-300 transition-all">
                {editingSizeIndex === idx ? (
                  <div className="flex items-center gap-1 w-full">
                    <input
                      type="text"
                      value={editingSizeValue}
                      onChange={(e) => setEditingSizeValue(e.target.value)}
                      className="w-16 px-1.5 py-0.5 border border-amber-500 rounded text-xs font-mono font-black"
                    />
                    <button
                      onClick={() => handleSaveEditedSize(idx)}
                      className="text-emerald-600 p-1 hover:bg-emerald-50 rounded"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingSizeIndex(null)}
                      className="text-stone-400 p-1 hover:bg-stone-200 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-mono font-black text-stone-900 text-sm">{sz}</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleMoveSize(idx, 'up')}
                        disabled={idx === 0}
                        className="text-stone-400 hover:text-stone-700 p-0.5 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveSize(idx, 'down')}
                        disabled={idx === masterSizes.length - 1}
                        className="text-stone-400 hover:text-stone-700 p-0.5 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingSizeIndex(idx);
                          setEditingSizeValue(sz);
                        }}
                        className="text-stone-400 hover:text-amber-700 p-0.5 cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteSize(sz)}
                        className="text-stone-400 hover:text-rose-600 p-0.5 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: SIZE CHARTS */}
      {activeSubTab === 'charts' && (
        <div className="space-y-6">
          {sizeCharts.map((chart, chartIdx) => (
            <div key={chart.categoryId} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-stone-950">{chart.categoryName} ({chart.categoryNameBn})</h3>
                  <p className="text-xs text-stone-500">{chart.measuringGuide}</p>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                  {chart.chartRows.length} Sizes Defined
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase">
                    <tr>
                      <th className="py-2 px-3">Size</th>
                      <th className="py-2 px-3">Chest (Inches)</th>
                      <th className="py-2 px-3">Length (Inches)</th>
                      <th className="py-2 px-3">Shoulder</th>
                      <th className="py-2 px-3">Weight Recommendation</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {chart.chartRows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-stone-50">
                        <td className="py-2 px-3 font-bold text-stone-900">{row.size}</td>
                        <td className="py-2 px-3">{row.chestInches}"</td>
                        <td className="py-2 px-3">{row.lengthInches}"</td>
                        <td className="py-2 px-3">{row.shoulderInches ? `${row.shoulderInches}"` : '—'}</td>
                        <td className="py-2 px-3 text-stone-600 font-sans">{row.recommendedWeightKg || 'Standard Fit'}</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => handleDeleteChartRow(chartIdx, rowIdx)}
                            className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Remove Row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add New Row Form */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-wrap items-center gap-3 text-xs">
                <span className="font-bold text-stone-700">Add Row:</span>
                <select
                  value={newRowSize}
                  onChange={(e) => setNewRowSize(e.target.value)}
                  className="px-2 py-1 bg-white border border-stone-200 rounded font-mono font-bold"
                >
                  {masterSizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                  type="number"
                  placeholder="Chest (In)"
                  value={newRowChest}
                  onChange={(e) => setNewRowChest(Number(e.target.value))}
                  className="w-24 px-2 py-1 bg-white border border-stone-200 rounded font-mono"
                />
                <input
                  type="number"
                  placeholder="Length (In)"
                  value={newRowLength}
                  onChange={(e) => setNewRowLength(Number(e.target.value))}
                  className="w-24 px-2 py-1 bg-white border border-stone-200 rounded font-mono"
                />
                <input
                  type="number"
                  placeholder="Shoulder (In)"
                  value={newRowShoulder}
                  onChange={(e) => setNewRowShoulder(Number(e.target.value))}
                  className="w-24 px-2 py-1 bg-white border border-stone-200 rounded font-mono"
                />
                <input
                  type="text"
                  placeholder="Weight Fit (e.g. 70-80 kg)"
                  value={newRowFit}
                  onChange={(e) => setNewRowFit(e.target.value)}
                  className="w-36 px-2 py-1 bg-white border border-stone-200 rounded"
                />
                <button
                  onClick={() => handleAddChartRow(chartIdx)}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Row</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: COLOR SWATCHES */}
      {activeSubTab === 'colors' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-sm font-black text-stone-900">Master Color Palette Swatches</h3>
              <p className="text-xs text-stone-500">Pickable in product creation and customer color selection.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-8 h-8 rounded-lg border border-stone-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                placeholder="Color Name (EN)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="px-3 py-1.5 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Color Name (Bangla)"
                value={newColorNameBn}
                onChange={(e) => setNewColorNameBn(e.target.value)}
                className="px-3 py-1.5 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none font-bangla"
              />
              <button
                onClick={handleAddColor}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Color</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {colors.map((col, idx) => (
              <div key={idx} className="p-3 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between group hover:border-amber-300 transition-all">
                {editingColorIndex === idx ? (
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={editingColorHex}
                        onChange={(e) => setEditingColorHex(e.target.value)}
                        className="w-6 h-6 rounded border p-0.5"
                      />
                      <input
                        type="text"
                        value={editingColorName}
                        onChange={(e) => setEditingColorName(e.target.value)}
                        placeholder="EN"
                        className="w-18 px-1 py-0.5 border rounded text-[11px]"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <input
                        type="text"
                        value={editingColorNameBn}
                        onChange={(e) => setEditingColorNameBn(e.target.value)}
                        placeholder="BN"
                        className="w-20 px-1 py-0.5 border rounded text-[11px] font-bangla"
                      />
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleSaveEditedColor(idx)} className="text-emerald-600 p-0.5"><Save className="w-3 h-3" /></button>
                        <button onClick={() => setEditingColorIndex(null)} className="text-stone-400 p-0.5"><X className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5">
                      <div
                        style={{ backgroundColor: col.hex }}
                        className="w-6 h-6 rounded-full border border-stone-300 shrink-0 shadow-xs"
                      />
                      <div>
                        <div className="font-bold text-xs text-stone-900">{col.name}</div>
                        <div className="text-[10px] text-stone-500 font-bangla">{col.nameBn}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleMoveColor(idx, 'up')}
                        disabled={idx === 0}
                        className="text-stone-400 hover:text-stone-700 p-0.5 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveColor(idx, 'down')}
                        disabled={idx === colors.length - 1}
                        className="text-stone-400 hover:text-stone-700 p-0.5 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingColorIndex(idx);
                          setEditingColorName(col.name);
                          setEditingColorNameBn(col.nameBn || '');
                          setEditingColorHex(col.hex);
                        }}
                        className="text-stone-400 hover:text-amber-700 p-0.5 cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteColor(idx)}
                        className="text-stone-400 hover:text-rose-600 p-0.5 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
