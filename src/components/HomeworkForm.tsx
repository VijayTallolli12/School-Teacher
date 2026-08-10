import { useEffect, useState } from "react";
import { cardShadow } from "../theme/shadows";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { HomeworkPayload, TeacherClass } from "@/types";


interface HomeworkFormProps {
  initialData?: HomeworkPayload;
  classes: TeacherClass[];
  onSubmit: (data: HomeworkPayload) => void;
  isSubmitting?: boolean;
}

export function HomeworkForm({ initialData, classes, onSubmit, isSubmitting }: HomeworkFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [subject, setSubject] = useState(initialData?.subject ?? "");
  const [selectedClass, setSelectedClass] = useState(initialData?.class ?? "");
  const [section, setSection] = useState(initialData?.section ?? "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? "");
      setDescription(initialData.description ?? "");
      setSubject(initialData.subject ?? "");
      setSelectedClass(initialData.class ?? "");
      setSection(initialData.section ?? "");
      setDueDate(initialData.dueDate ?? "");
    }
  }, [initialData]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!description.trim()) e.description = "Description is required";
    if (!subject.trim()) e.subject = "Subject is required";
    if (!selectedClass) e.class = "Select a class";
    if (!section.trim()) e.section = "Section is required";
    if (!dueDate.trim()) {
      e.dueDate = "Due date is required";
    } else {
      const d = new Date(dueDate);
      if (isNaN(d.getTime())) {
        e.dueDate = "Use YYYY-MM-DD format";
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);
        if (d < today) e.dueDate = "Due date cannot be in the past";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      class: selectedClass,
      section: section.trim(),
      dueDate: dueDate.trim(),
    });
  };

  const handleClassSelect = (cls: TeacherClass) => {
    setSelectedClass(cls.name);
    setSection(cls.section);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.class;
      delete next.section;
      return next;
    });
  };

  return (
    <View className="pt-4 px-4 pb-8 gap-5">
      {/* Title */}
      <View>
        <Text className="text-slate-700 text-sm font-semibold mb-1.5">Title *</Text>
        <TextInput
          className={`bg-white border rounded-xl px-4 py-3 text-slate-800 text-sm ${errors.title ? "border-status-error" : "border-surface-border"}`}
          style={cardShadow}
          value={title}
          onChangeText={(v) => { setTitle(v); setErrors((p) => { const n = { ...p }; delete n.title; return n; }); }}
          placeholder="Enter homework title"
          placeholderTextColor="#94A3B8"
        />
        {errors.title && <Text className="text-status-error text-xs mt-1">{errors.title}</Text>}
      </View>

      {/* Description */}
      <View>
        <Text className="text-slate-700 text-sm font-semibold mb-1.5">Description *</Text>
        <TextInput
          className={`bg-white border rounded-xl px-4 py-3 text-slate-800 text-sm min-h-[100px] ${errors.description ? "border-status-error" : "border-surface-border"}`}
          style={cardShadow}
          value={description}
          onChangeText={(v) => { setDescription(v); setErrors((p) => { const n = { ...p }; delete n.description; return n; }); }}
          placeholder="Enter homework description"
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        {errors.description && <Text className="text-status-error text-xs mt-1">{errors.description}</Text>}
      </View>

      {/* Subject */}
      <View>
        <Text className="text-slate-700 text-sm font-semibold mb-1.5">Subject *</Text>
        <TextInput
          className={`bg-white border rounded-xl px-4 py-3 text-slate-800 text-sm ${errors.subject ? "border-status-error" : "border-surface-border"}`}
          style={cardShadow}
          value={subject}
          onChangeText={(v) => { setSubject(v); setErrors((p) => { const n = { ...p }; delete n.subject; return n; }); }}
          placeholder="Enter subject"
          placeholderTextColor="#94A3B8"
        />
        {errors.subject && <Text className="text-status-error text-xs mt-1">{errors.subject}</Text>}
      </View>

      {/* Class */}
      <View>
        <Text className="text-slate-700 text-sm font-semibold mb-1.5">Class *</Text>
        <View className="flex-row flex-wrap gap-2">
          {classes.map((cls) => {
            const isActive = selectedClass === cls.name && section === cls.section;
            return (
              <TouchableOpacity
                key={cls.id}
                className={`rounded-xl px-4 py-2.5 border ${isActive ? "bg-primary-600 border-primary-600" : "bg-white border-surface-border"}`}
                style={isActive ? undefined : cardShadow}
                activeOpacity={0.7}
                onPress={() => handleClassSelect(cls)}
                accessibilityRole="button"
                accessibilityLabel={`Select class ${cls.name} ${cls.section}`}
                accessibilityState={{ selected: isActive }}
              >
                <Text className={`text-xs font-semibold ${isActive ? "text-white" : "text-slate-600"}`}>
                  {cls.name} - {cls.section}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.class && <Text className="text-status-error text-xs mt-1">{errors.class}</Text>}
      </View>

      {/* Section (hidden — auto-filled by class select) */}
      {errors.section && <Text className="text-status-error text-xs -mt-3">{errors.section}</Text>}

      {/* Due Date */}
      <View>
        <Text className="text-slate-700 text-sm font-semibold mb-1.5">Due Date *</Text>
        <TextInput
          className={`bg-white border rounded-xl px-4 py-3 text-slate-800 text-sm ${errors.dueDate ? "border-status-error" : "border-surface-border"}`}
          style={cardShadow}
          value={dueDate}
          onChangeText={(v) => { setDueDate(v); setErrors((p) => { const n = { ...p }; delete n.dueDate; return n; }); }}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#94A3B8"
        />
        {errors.dueDate && <Text className="text-status-error text-xs mt-1">{errors.dueDate}</Text>}
      </View>

      {/* Submit */}
      <TouchableOpacity
        className={`flex-row items-center justify-center py-3.5 rounded-xl ${isSubmitting ? "bg-primary-400" : "bg-primary-600"}`}
        activeOpacity={0.7}
        onPress={handleSubmit}
        disabled={isSubmitting}
        accessibilityRole="button"
        accessibilityLabel={initialData ? "Update homework" : "Create homework"}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="checkmark-outline" size={18} color="#FFFFFF" />
            <Text className="text-white font-semibold text-sm ml-2">
              {initialData ? "Update Homework" : "Create Homework"}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
