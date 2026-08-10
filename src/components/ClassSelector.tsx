import { useState } from "react";
import { cardShadow } from "../theme/shadows";
import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { TeacherClass } from "@/types";


interface ClassSelectorProps {
  classes: TeacherClass[];
  selectedClass: TeacherClass | null;
  onSelectClass: (cls: TeacherClass) => void;
}

export function ClassSelector({ classes, selectedClass, onSelectClass }: ClassSelectorProps) {
  const [showModal, setShowModal] = useState(false);

  if (!classes || classes.length === 0) return null;

  const selected = selectedClass ?? classes[0];
  const isMulti = classes.length > 1;

  if (!isMulti) {
    return (
      <View className="min-h-[52px] flex-row items-center bg-white border border-surface-border rounded-2xl px-4 py-2.5" style={cardShadow}>
        <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
          <Text className="text-primary-600 font-bold text-sm">
            {selected?.name?.charAt(0) ?? "?"}
          </Text>
        </View>
        <View className="flex-1 min-w-0">
          <Text className="text-slate-900 font-semibold text-sm" numberOfLines={1}>
            {selected?.name ?? 'Unnamed'} - {selected?.section ?? ''}
          </Text>
          {selected?.subject && (
            <Text className="text-slate-500 text-xs mt-0.5" numberOfLines={1}>
              {selected?.subject ?? ''}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-down" size={16} color="#94A3B8" />
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        className="min-h-[52px] flex-row items-center bg-white border border-surface-border rounded-2xl px-4 py-2.5"
        activeOpacity={0.7}
        style={cardShadow}
        onPress={() => setShowModal(true)}
      >
        <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
          <Text className="text-primary-600 font-bold text-sm">
            {selected?.name?.charAt(0) ?? "?"}
          </Text>
        </View>
        <View className="flex-1 min-w-0">
          <Text className="text-slate-900 font-semibold text-sm" numberOfLines={1}>
            {selected?.name ?? 'Unnamed'} - {selected?.section ?? ''}
          </Text>
          {selected?.subject && (
            <Text className="text-slate-500 text-xs mt-0.5" numberOfLines={1}>
              {selected?.subject ?? ''}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-down" size={16} color="#94A3B8" />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/25 px-6"
          onPress={() => setShowModal(false)}
        >
          <Pressable
            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
            onPress={() => {}}
          >
            <View className="px-5 pt-5 pb-3">
              <Text className="text-slate-900 text-[18px] font-semibold">Switch Class</Text>
              <Text className="text-slate-400 text-xs mt-1">Select a class to view its data</Text>
            </View>

            <ScrollView className="max-h-80">
              {classes.map((cls) => {
                const isActive = cls.id === selectedClass?.id;
                return (
                  <TouchableOpacity
                    key={cls.id}
                    className={`flex-row items-center px-5 py-3.5 ${isActive ? "bg-primary-50/50" : ""}`}
                    activeOpacity={0.7}
                    onPress={() => {
                      onSelectClass(cls);
                      setShowModal(false);
                    }}
                  >
                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                      isActive ? "bg-primary-100" : "bg-slate-100"
                    }`}>
                      <Text className={`font-bold text-sm ${
                        isActive ? "text-primary-700" : "text-slate-500"
                      }`}>
                        {cls.name?.charAt(0) ?? "?"}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text className={`text-sm font-semibold flex-1 ${
                          isActive ? "text-primary-700" : "text-slate-800"
                        }`}>
                          {cls.name} - {cls.section}
                        </Text>
                        {isActive && (
                          <Ionicons name="checkmark-circle" size={18} color="#4F46E5" />
                        )}
                      </View>
                      {cls.subject && (
                        <Text className="text-slate-500 text-xs mt-0.5">
                          {cls.subject}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              className="px-5 py-3.5 border-t border-slate-100 items-center"
              activeOpacity={0.7}
              onPress={() => setShowModal(false)}
            >
              <Text className="text-slate-500 text-sm font-medium">Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
